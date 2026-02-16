# PRD: Black Swan Trend Radar v1.0

> 产品需求文档 | 版本 1.0 | 2026-02-16

---

## 0. 文档元信息

| 项目 | 内容 |
|------|------|
| 产品名称 | Black Swan Trend Radar (BSTR) |
| 定位 | DTC/跨境电商异常趋势早期发现工具 |
| 目标用户 | DTC 卖家、跨境电商创业者、选品团队 |
| 核心价值 | 在趋势爆发前 2-8 周识别高概率产品机会 |
| 技术基础 | 现有 CHENDING 平台 (React + TypeScript + Vite + Tailwind) |
| 数据依赖 | SerpApi (已集成) + 免费数据源 |
| 预算约束 | 月数据成本 < $50 |

---

## 1. 产品背景

### 1.1 问题定义

DTC/跨境电商卖家面临的核心问题：

1. **信息滞后** — 等你在 Amazon Best Sellers 看到爆品时，供应链已经饱和
2. **噪声过多** — 每天有上千个关键词在涨，99% 是无意义波动
3. **决策模糊** — 发现一个上升趋势，不知道该不该投入
4. **成本高** — 现有工具 (Helium 10, Jungle Scout) 月费 $50-200+，针对 Amazon 而非跨渠道

### 1.2 机会假设

以 COVID-19 为样本：

| 产品关键词 | 爆发前信号出现时间 | 爆发到主流时间 | 最佳进入窗口 |
|-----------|------------------|--------------|------------|
| face mask | 搜索量上升前 3 周 Reddit 已在讨论 | 约 4 周 | Phase 1 (涌现期) |
| home gym | 搜索量上升前 2 周 长尾词开始分化 | 约 6 周 | Phase 1 |
| pulse oximeter | 搜索量上升前 4 周 医疗论坛讨论 | 约 3 周 | Phase 0-1 |
| webcam | 搜索量上升前 1 周 Amazon 断货信号 | 约 2 周 | Phase 1-2 |

**假设：如果能在 Phase 1 阶段系统性发现这些信号，DTC 卖家能获得 2-8 周的先发优势。**

### 1.3 非疫情场景的黑天鹅模式

黑天鹅不只来自疫情。常见触发源：

| 触发源 | 示例 | 爆发模式 |
|--------|------|----------|
| 政策变化 | 关税调整、禁令 | 替代品需求暴增 |
| 病毒传播内容 | TikTok 爆款视频 | 48h 脉冲 → 长尾效应 |
| 技术突破 | ChatGPT 发布 | AI 周边产品井喷 |
| 气候事件 | 极端高温/寒潮 | 区域性需求暴增 |
| 健康潮流 | 冷水浴、筋膜枪 | 缓慢涌现 → 突然加速 |
| 供应链中断 | 苏伊士运河堵塞 | 替代供应商/替代品需求 |
| 名人效应 | 明星带货 | 脉冲型（需判断是否持续） |

---

## 2. 产品目标与非目标

### 2.1 目标 (Goals)

| 优先级 | 目标 | 成功指标 |
|--------|------|----------|
| P0 | 每日输出异常关键词列表 | 日均产出 5-15 个异常信号 |
| P0 | 假阳性率可控 | 信号准确率 > 40% (初期) |
| P1 | 信号早于主流 | 比 Google Trends "Breakout" 标记早 1-2 周 |
| P1 | 可行动的机会评估 | 每个信号附带 RACE 评分 |
| P2 | 持续学习迭代 | 回测框架可验证算法有效性 |

### 2.2 非目标 (Non-Goals)

| 明确不做 | 原因 |
|----------|------|
| 实时监控 | 日批处理已足够，实时成本太高 |
| 自动下单/选品 | 最终决策必须由人来做 |
| 全品类覆盖 | 专注 DTC 可跨境销售的实物产品 |
| 复杂 SaaS 系统 | 不做用户注册、订阅、多租户 |
| 原创数据源 | 不自建爬虫，依赖 API 和公开数据 |
| 竞品分析 | 不做卖家层面的竞争分析 |

---

## 3. 核心架构

### 3.1 系统总览

```
┌──────────────────────────────────────────────────────┐
│                  Black Swan Trend Radar               │
│                                                       │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │ 数据采集 │→│ 异常检测  │→│ 信号确认 │→│ 机会评估│ │
│  │  Layer 1 │  │  Layer 2  │  │ Layer 3  │  │Layer 4 │ │
│  └─────────┘  └──────────┘  └─────────┘  └────────┘ │
│       │             │             │            │      │
│  免费数据源     三阶导数模型   多源交叉验证   RACE 评分 │
│  + SerpApi     + Z-score     + 相位检测     + 报告    │
│                + 周期性过滤                            │
└──────────────────────────────────────────────────────┘
```

### 3.2 数据流

```
每日触发 (Cron / 手动)
    │
    ▼
[Step 1] 候选关键词收集 (免费，0 API 消耗)
    │  来源: Google Trends Daily, Reddit Hot, Amazon M&S
    │  产出: ~200-500 候选词
    │
    ▼
[Step 2] 初筛 - 去重 + 去噪 (免费，本地计算)
    │  排除: 品牌名、名人名、政治词、纯内容词
    │  排除: 已知季节性词（对比历史同期）
    │  产出: ~50-100 词
    │
    ▼
[Step 3] 异常检测 (消耗 ~10-15 次 SerpApi/天)
    │  对 Top 候选词查询 Google Trends 数据
    │  计算: Z-score, 二阶导数, 波动率
    │  产出: ~10-20 异常词
    │
    ▼
[Step 4] 深度验证 (消耗 ~5-10 次 SerpApi/天)
    │  交叉验证: Related Queries, Interest by Region
    │  长尾词分化检测
    │  产出: ~5-10 确认信号
    │
    ▼
[Step 5] 机会评估 + 报告生成 (本地计算)
    │  RACE 评分
    │  相位判断
    │  生成 Markdown 报告
    │
    ▼
[输出] 每日趋势报告 (Markdown / Notion)
```

**月 API 消耗估算：**
- Step 3: 15 次/天 × 30 天 = 450 次
- Step 4: 10 次/天 × 30 天 = 300 次
- 总计: ~750 次/月
- 成本: SerpApi Basic Plan $75/月 (5000 次) — 充裕
- 或: 降低到每天 10+5 次 = 450 次/月，Free Plan 不够，最低付费档即可

---

## 4. 核心模块详细设计

### 4.1 异常检测引擎 (Anomaly Detection Engine)

#### 4.1.1 三阶导数模型

对每个关键词的 Google Trends 时间序列数据，计算：

```
设 V(t) = t 时刻的搜索指数 (Google Trends 0-100)

一阶导数 (速度/增长率):
  V'(t) = V(t) - V(t-1)

二阶导数 (加速度):
  V''(t) = V'(t) - V'(t-1)

三阶导数 (急动度/jerk):
  V'''(t) = V''(t) - V''(t-1)
```

**异常判定规则：**

| 信号类型 | 条件 | 含义 | 优先级 |
|----------|------|------|--------|
| Jerk Spike | V'''(t) > 3σ | 增长突然加速的拐点 | 最高 |
| Acceleration Positive | V''(t) > 0 且持续 > 3 天 | 增长在加速 | 高 |
| Velocity Breakout | V'(t) > 历史均值 3 倍 | 增长率异常高 | 中 |
| Volume Surge | V(t) > 历史均值 2 倍 | 绝对量异常（可能已晚） | 低 |

其中 σ 为该关键词历史数据的标准差。

#### 4.1.2 Z-Score 标准化

```
Z(t) = (V(t) - μ) / σ

μ = 过去 52 周的均值
σ = 过去 52 周的标准差
```

| Z-Score | 含义 |
|---------|------|
| < 1.0 | 正常波动 |
| 1.0 - 2.0 | 轻微异常，值得关注 |
| 2.0 - 3.0 | 显著异常，高概率信号 |
| > 3.0 | 极端异常，强黑天鹅信号 |

#### 4.1.3 周期性过滤

目的：排除 "Christmas gifts" 之类的季节性关键词。

```
方法: 同比增长异常检测

seasonal_baseline = average(V(t-52w), V(t-104w))  // 去年和前年同期均值
seasonal_adjusted_growth = (V(t) - seasonal_baseline) / seasonal_baseline

if seasonal_adjusted_growth > 2.0:
    // 即使是季节性词，今年涨幅 > 同期 2 倍，可能叠加了黑天鹅
    flag_as_seasonal_plus_anomaly()
elif correlation(V(t..t-4w), V(t-52w..t-56w)) > 0.7:
    // 与去年走势高度相关，纯季节性
    exclude()
else:
    // 非季节性异常
    flag_as_anomaly()
```

#### 4.1.4 脉冲 vs 趋势区分

```
脉冲检测:
  peak = max(V(t..t-7d))
  after_peak = mean(V(peak+3d..peak+7d))

  if after_peak < peak * 0.3:
      // 涨完就跌，是脉冲（名人效应、单条视频等）
      mark_as_pulse()
  elif after_peak > peak * 0.6:
      // 涨完维持高位，是趋势
      mark_as_trend()
  else:
      // 中间地带，继续观察
      mark_as_uncertain()
```

### 4.2 多源信号确认 (Multi-Source Confirmation)

#### 4.2.1 数据源矩阵

| 数据源 | 获取方式 | 成本 | 信号类型 | 信号时序 |
|--------|----------|------|----------|----------|
| Google Trends | SerpApi | 按量付费 | 搜索兴趣 | 中期 (Phase 1-2) |
| Google Autocomplete | SerpApi / 免费 | 低 | 长尾词分化 | 早期 (Phase 0-1) |
| Reddit | Reddit API (免费) | 免费 | 讨论先行信号 | 最早 (Phase 0) |
| Amazon Movers & Shakers | 网页解析 | 免费 | 销量异常 | 中期 (Phase 2) |
| Google News | News API / GNews | 按量/免费 | 媒体关注度 | 中后期 (Phase 2-3) |
| TikTok Trending | 手动 + 非官方 API | 免费/低成本 | 病毒传播信号 | 早中期 (Phase 1) |
| Google Ads CPC | SerpApi Ads | 按量付费 | 商业竞争信号 | 中后期 (Phase 2-3) |

#### 4.2.2 信号确认矩阵

```
信号强度 = Σ(数据源权重 × 该源异常程度)

数据源权重 (基于信号先行性):
  Reddit 讨论:           0.25 (最早)
  Google Autocomplete:   0.20 (早期)
  Google Trends:         0.20 (核心)
  TikTok:                0.15 (早中期)
  Amazon:                0.10 (确认)
  News:                  0.10 (滞后确认)
```

**确认级别：**

| 级别 | 条件 | 行动建议 |
|------|------|----------|
| Level 0 | 1 个数据源异常 | 加入监控列表 |
| Level 1 | 2 个数据源异常 | 深度调研 |
| Level 2 | 3+ 个数据源异常 | 认真评估，准备行动 |
| Level 3 | 5+ 个数据源同步异常 | 立即行动或已经太晚 |

### 4.3 相位检测器 (Phase Detector)

对每个确认的异常关键词判定当前所处阶段：

| 相位 | Google Trends | 长尾词 | Reddit | Amazon | News | 行动建议 |
|------|--------------|--------|--------|--------|------|----------|
| Phase 0 潜伏 | 无变化 | 无 | 少量讨论 | 无 | 无 | 加入监控 |
| Phase 1 涌现 | Z>1, V''>0 | 开始出现 | 讨论增长 | 无/少量 | 无 | 深度调研 + 准备 |
| Phase 2 加速 | Z>2, Breakout | 大量分化 | 热帖 | 排名波动 | 开始报道 | 立即行动 |
| Phase 3 主流 | Z>3, 高峰 | 饱和 | 泛滥 | 大量 listing | 大量报道 | 谨慎进入/差异化 |

**相位判定算法：**

```
phase_scores = {
    0: 0,  // Phase 0
    1: 0,  // Phase 1
    2: 0,  // Phase 2
    3: 0   // Phase 3
}

// Google Trends 信号
if z_score < 1.0:
    phase_scores[0] += 1
elif z_score < 2.0 and acceleration > 0:
    phase_scores[1] += 1
elif z_score < 3.0 or trends_breakout:
    phase_scores[2] += 1
else:
    phase_scores[3] += 1

// 长尾词分化信号
if new_longtail_count == 0:
    phase_scores[0] += 1
elif new_longtail_count < 5:
    phase_scores[1] += 1
elif new_longtail_count < 20:
    phase_scores[2] += 1
else:
    phase_scores[3] += 1

// Reddit 信号
if reddit_mentions < 10:
    phase_scores[0] += 1
elif reddit_growth > 100%:
    phase_scores[1] += 1
elif reddit_hot_posts > 0:
    phase_scores[2] += 1
else:
    phase_scores[3] += 1

// Amazon 信号
if amazon_listings < 10:
    phase_scores[0] += 1
elif amazon_rank_change > 50%:
    phase_scores[1] += 1
elif amazon_movers_and_shakers:
    phase_scores[2] += 1
else:
    phase_scores[3] += 1

current_phase = argmax(phase_scores)
```

### 4.4 RACE 评分模型

#### R - Response Time (响应时间) | 权重 15%

评估你的供应链能否跟上趋势窗口。

| 供应模式 | 响应时间 | 分数 |
|----------|----------|------|
| Dropshipping (速卖通/CJ) | 1-3 天上架 | 5 |
| POD (Print on Demand) | 2-5 天 | 4 |
| 现货采购 (1688) | 1-2 周 | 3 |
| OEM 小批量 | 4-8 周 | 2 |
| 品牌定制 | 3-6 月 | 1 |

**注：该分数由用户自己设定供应链模式，系统不自动判断。**

#### A - Addressable Gap (可切入空白) | 权重 30%

量化市场空白程度。

| 指标 | 数据源 | 得分规则 |
|------|--------|----------|
| Amazon listing 数量 | SerpApi Amazon | <50: 5分, 50-200: 4分, 200-1000: 3分, >1000: 2分 |
| Google Shopping 结果 | SerpApi | <20: 5分, 20-100: 3分, >100: 1分 |
| 品牌集中度 | Amazon 前 10 结果 | 无明显品牌: 5分, 1-2个品牌: 3分, 强品牌垄断: 1分 |
| 现有产品评分 | Amazon 平均星级 | <3.5星: 5分(有改善空间), 3.5-4.2: 3分, >4.2: 1分 |

```
A_score = (listing_score + shopping_score + brand_score + rating_score) / 4
```

#### C - Category Fit (品类契合) | 权重 25%

评估产品是否适合 DTC 跨境。

| 指标 | 得分规则 |
|------|----------|
| 重量 | <0.5kg: 5分, 0.5-2kg: 4分, 2-5kg: 3分, >5kg: 1分 |
| 单价 | $20-80: 5分 (甜蜜区), $10-20: 3分, >$80: 2分, <$10: 1分 |
| 认证要求 | 无需认证: 5分, CE/FCC: 3分, FDA/医疗: 1分 |
| 退货率预估 | <5%: 5分, 5-15%: 3分, >15%: 1分 |
| 可差异化程度 | 外观/颜色: 5分, 功能: 3分, 同质化严重: 1分 |

```
C_score = (weight + price + cert + return + diff) / 5
```

**注：C 分数部分需要人工判断，系统提供参考框架。**

#### E - Evidence Strength (证据强度) | 权重 30%

```
E_score 直接来自信号确认系统:

Level 0 (单源): 1 分
Level 1 (双源): 2.5 分
Level 2 (三源+): 4 分
Level 3 (全面收敛): 5 分
```

#### 综合 RACE 评分

```
RACE = R × 0.15 + A × 0.30 + C × 0.25 + E × 0.30

评级:
  RACE >= 4.0  →  🔴 强烈建议行动
  RACE 3.0-4.0 →  🟡 值得深入调研
  RACE 2.0-3.0 →  🟢 持续监控
  RACE < 2.0   →  ⚪ 暂时搁置
```

---

## 5. 数据模型

### 5.1 核心类型定义

```typescript
// 异常信号
interface AnomalySignal {
  keyword: string;
  detectedAt: Date;

  // 三阶导数指标
  velocity: number;       // 一阶：增长率
  acceleration: number;   // 二阶：加速度
  jerk: number;           // 三阶：急动度
  zScore: number;         // 标准化异常程度

  // 信号分类
  signalType: 'jerk_spike' | 'acceleration' | 'velocity_breakout' | 'volume_surge';
  isPulse: boolean;       // 是否为脉冲（非趋势）
  isSeasonal: boolean;    // 是否为季节性
  seasonalAdjustedGrowth: number; // 季节性调整后增长
}

// 多源确认
interface SignalConfirmation {
  keyword: string;

  // 各数据源信号
  sources: {
    googleTrends: SourceSignal | null;
    googleAutocomplete: SourceSignal | null;
    reddit: SourceSignal | null;
    amazon: SourceSignal | null;
    news: SourceSignal | null;
    tiktok: SourceSignal | null;
  };

  confirmationLevel: 0 | 1 | 2 | 3;
  compositeScore: number;  // 0-100 综合信号强度
}

interface SourceSignal {
  source: string;
  isAnomalous: boolean;
  anomalyScore: number;  // 0-1
  dataPoints: any;       // 原始数据
  fetchedAt: Date;
}

// 相位判定
interface PhaseAssessment {
  keyword: string;
  currentPhase: 0 | 1 | 2 | 3;
  phaseScores: [number, number, number, number]; // 各相位得分
  confidence: number;    // 0-1 判定置信度
  estimatedPhaseAge: number; // 预估在当前阶段已持续天数
  phaseTrend: 'advancing' | 'stable' | 'retreating'; // 是否在向下一阶段推进
}

// RACE 评分
interface RACEScore {
  keyword: string;

  responseTime: number;      // R: 1-5
  addressableGap: number;    // A: 1-5
  categoryFit: number;       // C: 1-5
  evidenceStrength: number;  // E: 1-5

  composite: number;         // 加权综合分
  rating: 'strong_action' | 'deep_research' | 'monitor' | 'skip';

  // A 分的子指标
  addressableGapDetail: {
    listingCount: number;
    shoppingResults: number;
    brandConcentration: 'none' | 'low' | 'high';
    avgRating: number;
  };
}

// 每日报告中的趋势条目
interface TrendEntry {
  keyword: string;
  anomaly: AnomalySignal;
  confirmation: SignalConfirmation;
  phase: PhaseAssessment;
  race: RACEScore;

  // 趋势可视化数据
  chartData: { date: string; value: number }[];
  relatedKeywords: string[];    // 相关/长尾词
  relatedQueries: string[];     // Google Related Queries

  // AI 生成的摘要
  summary: string;
  actionSuggestion: string;
}

// 每日报告
interface DailyReport {
  date: Date;

  // 统计概览
  totalCandidatesScanned: number;
  anomaliesDetected: number;
  confirmedSignals: number;

  // 分层结果
  strongAction: TrendEntry[];    // RACE >= 4.0
  deepResearch: TrendEntry[];    // RACE 3.0-4.0
  monitor: TrendEntry[];         // RACE 2.0-3.0

  // 与昨日对比
  newSignals: string[];          // 今天新出现的
  escalated: string[];           // 从 monitor 升级到 research/action 的
  resolved: string[];            // 不再异常的（回落或已主流化）

  // API 消耗
  apiCallsUsed: number;
  apiCallsRemaining: number;
}
```

### 5.2 数据存储

MVP 阶段不使用数据库，全部使用本地存储：

| 数据 | 存储方式 | 保留期 |
|------|----------|--------|
| API 响应缓存 | localStorage (已有) | 24 小时 |
| 历史趋势数据 | IndexedDB | 90 天 |
| 异常信号记录 | IndexedDB | 永久 |
| 每日报告 | Markdown 文件导出 | 永久 |
| 用户配置 | localStorage | 永久 |
| RACE 评分历史 | IndexedDB | 90 天 |

---

## 6. MVP 功能清单

### 6.1 P0 - 必须有（MVP 核心）

#### F1: 每日异常扫描

**描述：** 用户点击"扫描"按钮，系统自动执行完整的异常检测流程。

**输入：**
- 种子关键词列表（可手动输入或从预设分类中选择）
- 或：使用系统内置的 1000+ 黑天鹅关键词库

**流程：**
1. 从种子关键词生成候选列表
2. 通过 SerpApi 获取 Google Trends 数据
3. 运行异常检测算法（三阶导数 + Z-Score）
4. 排除季节性和脉冲型波动
5. 按异常程度排序

**输出：**
- 异常关键词列表，每个包含：
  - 关键词
  - Z-Score
  - 信号类型（Jerk Spike / Acceleration / Velocity Breakout / Volume Surge）
  - 趋势迷你图
  - 二阶导数方向（加速/减速）

**API 消耗：** ~15-20 次 SerpApi 调用/次扫描

#### F2: 信号确认面板

**描述：** 对异常关键词进行多源交叉验证。

**输入：** F1 输出的异常关键词

**流程：**
1. 查询 Google Related Queries
2. 检查 Google Autocomplete 变化
3. （手动）用户可输入 Reddit/Amazon 观察结果

**输出：**
- 确认级别 (Level 0-3)
- 各数据源信号状态
- 综合信号强度分

**API 消耗：** ~5-10 次/次确认

#### F3: 趋势报告生成

**描述：** 将当日分析结果生成结构化报告。

**输出格式：** Markdown

**内容：**
```markdown
# Black Swan Trend Report - 2026-02-16

## 概览
- 扫描关键词: 150
- 检测到异常: 12
- 确认信号: 5

## 强行动信号 (RACE >= 4.0)

### 1. portable cold plunge tub
- Z-Score: 2.8 | 信号类型: Acceleration
- 相位: Phase 1 (涌现期)
- 趋势: [迷你图]
- 相关词: "cold plunge for home", "ice bath tub portable"
- RACE: R=4 A=4.2 C=3.8 E=3.5 | 综合: 3.9
- 建议: 趋势处于涌现期，长尾词分化明显，建议立即调研供应链

## 深度调研信号 (RACE 3.0-4.0)
...

## 监控列表 (RACE 2.0-3.0)
...

## 与昨日对比
- 新增: keyword_a, keyword_b
- 升级: keyword_c (从监控升级到深度调研)
- 移除: keyword_d (回落至正常水平)
```

#### F4: 异常检测核心算法

**描述：** 实现 Section 4.1 中定义的所有算法。

包含：
- 三阶导数计算
- Z-Score 标准化
- 周期性过滤
- 脉冲 vs 趋势区分

### 6.2 P1 - 应该有（增强功能）

#### F5: RACE 交互式评分

**描述：** 用户可以对每个信号进行 RACE 评分。

- R (响应时间): 用户选择自己的供应链模式
- A (可切入空白): 系统通过 SerpApi 自动评估 + 用户微调
- C (品类契合): 用户根据指引手动评分
- E (证据强度): 系统自动评分

#### F6: 相位检测可视化

**描述：** 将关键词的相位以时间线方式可视化。

显示：
- 当前相位 (Phase 0-3)
- 各相位得分柱状图
- 相位推进方向

#### F7: 历史回测

**描述：** 用已知的黑天鹅事件回测算法有效性。

用例：
- 输入 "pulse oximeter"，查看算法是否能在 Phase 1 检测到
- 对比算法检测时间 vs 实际爆发时间
- 统计假阳性率和漏检率

#### F8: 监控列表

**描述：** 用户可将关键词加入监控列表，每日自动跟踪。

- 与现有 Favorites 功能整合
- 每日自动更新信号状态
- 变化提醒（相位推进、确认级别变化）

### 6.3 P2 - 可以有（未来迭代）

#### F9: Reddit 自动扫描

- 集成 Reddit API
- 自动监控指定 subreddit 的讨论变化
- 新 subreddit 出现检测

#### F10: Amazon Movers & Shakers 集成

- 定期抓取 Amazon 页面
- 排名波动异常检测
- 与 Google Trends 信号交叉验证

#### F11: Notion 自动同步

- 将每日报告自动推送到 Notion 数据库
- 支持 Notion 内直接查看趋势图
- 双向同步（在 Notion 中标注的状态回同步）

#### F12: AI 摘要与建议

- 使用 LLM (Claude API) 对每个信号生成：
  - 自然语言趋势解读
  - 潜在产品方向建议
  - 风险提示
  - 供应链建议

---

## 7. UI/UX 设计

### 7.1 页面结构（基于现有架构扩展）

```
┌──────────────────────────────────────────┐
│  Header (已有)                            │
├──────────────────────────────────────────┤
│  [扫描控制面板]                            │
│  ┌────────────┬─────────────────────────┐│
│  │ 种子关键词   │ [开始扫描] [上次: 2h ago] ││
│  │ 输入/选择    │ API 余量: 4250/5000     ││
│  └────────────┴─────────────────────────┘│
├──────────────────────────────────────────┤
│  [Stats Overview] (改造现有组件)            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│  │异常数  │ │确认数  │ │Phase 1│ │强行动  │    │
│  │ 12   │ │ 5    │ │ 3    │ │ 1    │    │
│  └──────┘ └──────┘ └──────┘ └──────┘    │
├──────────────────────────────────────────┤
│  [Tab: 强行动 | 深度调研 | 监控 | 全部]       │
├──────────────────────────────────────────┤
│  [趋势表格] (改造现有 TrendTable)           │
│  ┌─────────────────────────────────────┐ │
│  │ 关键词 | Z分 | 信号 | 相位 | RACE | ▶ │ │
│  │ cold.. | 2.8 | Acc  | P1  | 3.9  |   │ │
│  │        展开: 趋势图 + 详情 + RACE     │ │
│  └─────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│  [报告导出] [Markdown] [CSV]              │
├──────────────────────────────────────────┤
│  Footer (已有)                            │
└──────────────────────────────────────────┘
```

### 7.2 关键交互

1. **扫描流程：** 点击"开始扫描" → 显示进度条 + 当前步骤 → 完成后刷新表格
2. **信号展开：** 点击表格行展开详情面板，显示趋势图、多源信号、RACE 评分
3. **RACE 评分：** 在展开面板中，A 和 E 自动填充，R 和 C 需用户选择/评分
4. **报告导出：** 一键生成 Markdown 报告，可复制或下载

---

## 8. 技术实现方案

### 8.1 与现有代码的集成

现有代码已有的基础设施：

| 已有组件 | 复用方式 |
|----------|----------|
| `googleTrendsService.ts` | 扩展，增加批量查询 + 历史数据获取 |
| `dataTransformer.ts` | 重构，增加三阶导数计算 |
| `searchCache.ts` | 扩展，增加 IndexedDB 支持 |
| `TrendTable.tsx` | 重构，增加信号列、RACE 列、展开面板 |
| `TrendChart.tsx` | 扩展，增加导数叠加显示 |
| `StatsOverview.tsx` | 改造，显示异常/确认/相位统计 |
| `mockData.ts` | 作为种子关键词库 |
| 缓存系统 | 扩展 TTL，增加历史数据保留 |

### 8.2 新增模块

```
src/
├── engines/
│   ├── anomalyDetector.ts      // 三阶导数 + Z-Score + 过滤
│   ├── signalConfirmer.ts      // 多源交叉验证
│   ├── phaseDetector.ts        // 相位检测
│   └── raceScorer.ts           // RACE 评分
│
├── services/
│   ├── googleTrendsService.ts  // (扩展) 增加历史数据获取
│   ├── redditService.ts        // Reddit API (P2)
│   ├── amazonService.ts        // Amazon 数据 (P2)
│   └── reportGenerator.ts      // Markdown 报告生成
│
├── stores/
│   └── trendStore.ts           // 历史数据存储 (IndexedDB)
│
├── components/
│   ├── ScanPanel.tsx           // 扫描控制面板
│   ├── SignalDetail.tsx        // 信号详情展开面板
│   ├── PhaseIndicator.tsx      // 相位可视化
│   ├── RACEScoreCard.tsx       // RACE 评分卡
│   └── ReportExporter.tsx      // 报告导出
│
└── utils/
    ├── derivatives.ts          // 数学计算：导数、Z-Score
    ├── seasonalFilter.ts       // 周期性过滤
    └── pulseDetector.ts        // 脉冲检测
```

### 8.3 依赖

| 依赖 | 用途 | 是否新增 |
|------|------|----------|
| React 18 | UI 框架 | 已有 |
| TypeScript | 类型安全 | 已有 |
| Tailwind CSS | 样式 | 已有 |
| Lucide React | 图标 | 已有 |
| idb (IndexedDB wrapper) | 历史数据存储 | 新增 |
| date-fns | 日期处理 | 新增 |

不引入：
- 状态管理库（React Context 够用）
- 图表库（现有 SVG 图表够用）
- CSS 框架（Tailwind 够用）

---

## 9. API 调用策略

### 9.1 SerpApi 调用优化

```
原则: 每次 API 调用都必须物有所值

优化策略:
1. 批量查询 - 一次请求最多 5 个关键词 (SerpApi 支持)
2. 缓存优先 - 24h 内同一关键词不重复查询
3. 渐进式查询 - 先粗筛再深查
4. 智能调度 - 高优先级关键词优先消耗配额
```

### 9.2 月度配额分配

以 SerpApi Basic Plan (5000 次/月) 为例：

| 用途 | 每日 | 每月 | 占比 |
|------|------|------|------|
| 初筛扫描 (Google Trends) | 15 | 450 | 9% |
| 深度验证 (Related Queries) | 10 | 300 | 6% |
| 竞争度检查 (Amazon/Shopping) | 5 | 150 | 3% |
| 监控列表更新 | 10 | 300 | 6% |
| 缓冲 | - | 3800 | 76% |

**76% 缓冲是故意的** — 留给突发事件需要加大扫描力度时使用。

### 9.3 降级策略

当 API 配额不足时：

| 剩余配额 | 策略 |
|----------|------|
| > 50% | 正常模式 |
| 30-50% | 减少初筛频率，聚焦确认 |
| 10-30% | 只更新监控列表 |
| < 10% | 只使用缓存数据，不发新请求 |

---

## 10. 里程碑与迭代计划

### Milestone 1: 核心算法 (Week 1-2)

- [ ] 实现三阶导数计算模块
- [ ] 实现 Z-Score 标准化
- [ ] 实现周期性过滤
- [ ] 实现脉冲检测
- [ ] 用历史数据单元测试

### Milestone 2: 数据管道 (Week 3-4)

- [ ] 扩展 SerpApi 服务（历史数据获取）
- [ ] 实现渐进式验证管道
- [ ] 实现 IndexedDB 历史存储
- [ ] 实现 API 配额管理

### Milestone 3: 评估模型 (Week 5-6)

- [ ] 实现多源信号确认框架
- [ ] 实现相位检测器
- [ ] 实现 RACE 评分模型
- [ ] 用已知黑天鹅事件回测

### Milestone 4: UI 整合 (Week 7-8)

- [ ] 扫描控制面板
- [ ] 改造 TrendTable（信号列、RACE 列）
- [ ] 信号详情展开面板
- [ ] 报告生成器

### Milestone 5: 验证与优化 (Week 9-10)

- [ ] 实际数据运行 2 周
- [ ] 统计假阳性率
- [ ] 调整算法参数
- [ ] 优化 API 消耗

---

## 11. 风险与缓解

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| SerpApi 数据延迟 | 高 | 中 | Google Trends 数据天然有 1-3 天延迟，接受并在报告中标注 |
| 假阳性率过高 | 高 | 高 | 多级过滤 + 人工确认环节 + 持续回测调参 |
| 季节性误判 | 中 | 中 | 同比数据对比 + 用户可手动标记 |
| API 配额不足 | 低 | 中 | 渐进式验证 + 降级策略 + 缓冲池设计 |
| Google Trends 相对值误导 | 中 | 中 | 只用相对变化，不还原绝对值 |
| 信号发现太晚（Phase 2+）| 中 | 高 | Reddit/Autocomplete 等先行信号源，但 MVP 阶段接受此限制 |

---

## 12. 成功指标

### 12.1 短期 (1 个月)

| 指标 | 目标 |
|------|------|
| 日产出信号数 | 5-15 个 |
| 假阳性率 | < 60% (初期可接受) |
| 每日操作耗时 | < 15 分钟（看报告 + RACE 评分） |
| API 成本 | < $75/月 |

### 12.2 中期 (3 个月)

| 指标 | 目标 |
|------|------|
| 假阳性率 | < 40% (参数优化后) |
| Phase 1 发现率 | > 30% 的确认信号在 Phase 1 被发现 |
| 可行动率 | > 20% 的信号最终成为可行产品方向 |
| 算法稳定性 | 连续 30 天无重大误判 |

### 12.3 长期 (6 个月)

| 指标 | 目标 |
|------|------|
| ROI | 至少 1 个通过工具发现的产品成功上架并盈利 |
| 假阳性率 | < 30% |
| 工具信任度 | 用户每日使用成为习惯 |

---

## 附录 A: 术语表

| 术语 | 定义 |
|------|------|
| 黑天鹅 | 低概率、高影响、事后看似可预测的趋势事件 |
| Phase | 关键词趋势所处的生命周期阶段 (0-3) |
| Z-Score | 标准分数，衡量数据点偏离均值的程度 |
| Jerk | 加速度的变化率（三阶导数） |
| RACE | Response-Addressable-Category-Evidence 评分模型 |
| 脉冲 | 短暂的搜索量激增后快速回落 |
| 长尾分化 | 核心关键词衍生出大量修饰词变体 |
| 确认级别 | 多少个独立数据源验证了异常信号 (Level 0-3) |

## 附录 B: 与 OpenAI 方案的差异对比

| 维度 | OpenAI 方案 | 本 PRD |
|------|------------|--------|
| 核心思路 | 数据收集 + 简单公式 | 信号处理 + 多层验证 |
| 异常检测 | 增长率 > 200% | 三阶导数 + Z-Score + 周期过滤 |
| 评分模型 | TOP 2.0 (权重拍脑袋) | RACE (Evidence 权重最高) |
| 成本控制 | 列举 API 但无调用策略 | 渐进式验证漏斗 + 配额管理 |
| 季节性处理 | "排除" (未说明方法) | 同比对照 + 相关性检测 |
| 信号确认 | 无层级 | 4 级确认体系 |
| 阶段判断 | 无 | 4 阶段相位检测 |
| 行动框架 | 笼统建议 | RACE 量化评分 + 行动分级 |
| 输出格式 | Markdown + Notion | Markdown (可扩展 Notion) |
| 实现路径 | 不明确 | 5 个里程碑 + 具体模块划分 |
