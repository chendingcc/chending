import { AIKeyword, AIBlackSwanCategory } from '../types';

// AI时代黑天鹅关键词数据库
export const aiBlackSwanKeywords: AIBlackSwanCategory[] = [
  {
    name: 'Large Language Models & Foundation Models',
    totalKeywords: 45,
    avgRelevanceScore: 9.2,
    highRiskCount: 12,
    keywords: [
      {
        name: 'ChatGPT',
        relevanceScore: 10,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Explosive',
        applicationField: 'Conversational AI',
        description: '革命性的对话式AI模型，改变了人机交互方式',
        opportunities: ['客服自动化', '内容创作', '教育辅助', '代码生成'],
        risks: ['信息准确性', '版权争议', '就业替代', '依赖性风险']
      },
      {
        name: 'GPT-4',
        relevanceScore: 10,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Explosive',
        applicationField: 'Multi-modal AI',
        description: '多模态大语言模型，具备文本和图像理解能力',
        opportunities: ['多模态应用', '复杂推理', '创意设计', '专业咨询'],
        risks: ['计算成本', '数据隐私', '模型偏见', '滥用风险']
      },
      {
        name: 'Claude',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Constitutional AI',
        description: 'Anthropic开发的安全对话AI，注重AI安全和对齐',
        opportunities: ['安全AI应用', '企业级部署', '研究辅助', '内容审核'],
        risks: ['竞争压力', '技术限制', '商业化挑战', '监管风险']
      },
      {
        name: 'Gemini',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Multi-modal AI',
        description: 'Google的多模态AI模型，整合搜索和AI能力',
        opportunities: ['搜索革新', '移动AI', '云服务', '开发者工具'],
        risks: ['隐私担忧', '垄断风险', '技术依赖', '数据安全']
      },
      {
        name: 'LLaMA',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Open Source AI',
        description: 'Meta的开源大语言模型，推动AI民主化',
        opportunities: ['开源生态', '定制化应用', '研究加速', '成本降低'],
        risks: ['滥用风险', '质量控制', '支持挑战', '商业模式']
      },
      {
        name: 'PaLM',
        relevanceScore: 8,
        businessValue: 'Medium',
        riskLevel: 'Medium',
        trendPrediction: 'Stable',
        applicationField: 'Language Understanding',
        description: 'Google的大规模语言模型，专注语言理解',
        opportunities: ['语言处理', '翻译服务', '文档分析', '知识提取'],
        risks: ['计算资源', '模型复杂性', '维护成本', '技术门槛']
      },
      {
        name: 'BERT',
        relevanceScore: 7,
        businessValue: 'Medium',
        riskLevel: 'Low',
        trendPrediction: 'Stable',
        applicationField: 'Natural Language Processing',
        description: '双向编码器表示，在NLP任务中广泛应用',
        opportunities: ['搜索优化', '文本分类', '情感分析', '问答系统'],
        risks: ['技术过时', '性能限制', '资源需求', '替代风险']
      },
      {
        name: 'T5',
        relevanceScore: 7,
        businessValue: 'Medium',
        riskLevel: 'Low',
        trendPrediction: 'Stable',
        applicationField: 'Text-to-Text Transfer',
        description: '文本到文本的转换模型，统一NLP任务框架',
        opportunities: ['任务统一', '迁移学习', '多语言支持', '自动化流程'],
        risks: ['模型复杂性', '训练成本', '专业门槛', '维护难度']
      },
      {
        name: 'Transformer Architecture',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Low',
        trendPrediction: 'Stable',
        applicationField: 'Deep Learning',
        description: '注意力机制架构，现代AI模型的基础',
        opportunities: ['模型创新', '架构优化', '效率提升', '应用扩展'],
        risks: ['计算复杂度', '内存需求', '优化挑战', '理解难度']
      },
      {
        name: 'Fine-tuning',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Model Customization',
        description: '模型微调技术，适应特定任务和领域',
        opportunities: ['定制化服务', '领域专精', '性能优化', '成本控制'],
        risks: ['过拟合风险', '数据需求', '技术门槛', '质量控制']
      }
    ]
  },
  {
    name: 'AI Applications & Business Opportunities',
    totalKeywords: 38,
    avgRelevanceScore: 8.7,
    highRiskCount: 8,
    keywords: [
      {
        name: 'AI Coding Assistant',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Explosive',
        applicationField: 'Software Development',
        description: 'AI辅助编程工具，提高开发效率',
        opportunities: ['开发加速', '代码质量', '学习辅助', '自动化测试'],
        risks: ['代码安全', '依赖性', '技能退化', '版权问题']
      },
      {
        name: 'GitHub Copilot',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Code Generation',
        description: 'GitHub的AI编程助手，实时代码建议',
        opportunities: ['编程效率', '代码补全', '学习工具', '团队协作'],
        risks: ['代码质量', '安全漏洞', '许可证问题', '过度依赖']
      },
      {
        name: 'Vibe Coding',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'AI-Powered Development',
        description: 'AI驱动的直觉式编程体验，通过自然语言和意图理解进行代码生成',
        opportunities: ['直觉编程', '自然语言编码', '创意实现', '快速原型'],
        risks: ['代码可控性', '逻辑准确性', '调试困难', '学习曲线']
      },
      {
        name: 'Cursor AI IDE',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'AI-Native IDE',
        description: 'AI原生集成开发环境，支持自然语言编程和智能代码生成',
        opportunities: ['AI原生开发', '智能补全', '代码重构', '自动优化'],
        risks: ['工具依赖', '性能开销', '隐私担忧', '兼容性问题']
      },
      {
        name: 'Replit Ghostwriter',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Cloud-based AI Coding',
        description: 'Replit的AI编程助手，云端智能代码生成和补全',
        opportunities: ['云端开发', '协作编程', '即时部署', '多语言支持'],
        risks: ['网络依赖', '数据安全', '服务稳定性', '成本控制']
      },
      {
        name: 'Tabnine AI',
        relevanceScore: 7,
        businessValue: 'Medium',
        riskLevel: 'Low',
        trendPrediction: 'Stable',
        applicationField: 'Code Completion',
        description: 'AI驱动的代码自动补全工具，支持多种编程语言',
        opportunities: ['代码补全', '效率提升', '多IDE支持', '团队定制'],
        risks: ['准确性限制', '上下文理解', '性能影响', '订阅成本']
      },
      {
        name: 'CodeWhisperer',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'AWS AI Coding',
        description: 'Amazon的AI代码生成服务，集成AWS生态系统',
        opportunities: ['AWS集成', '云服务优化', '安全扫描', '企业级支持'],
        risks: ['平台锁定', '成本累积', '学习成本', '功能限制']
      },
      {
        name: 'Codeium',
        relevanceScore: 7,
        businessValue: 'Medium',
        riskLevel: 'Low',
        trendPrediction: 'Rising',
        applicationField: 'Free AI Coding',
        description: '免费的AI编程助手，提供代码生成和补全功能',
        opportunities: ['免费使用', '多语言支持', '快速集成', '社区驱动'],
        risks: ['功能限制', '商业模式', '数据隐私', '服务持续性']
      },
      {
        name: 'AI Pair Programming',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Explosive',
        applicationField: 'Collaborative Development',
        description: 'AI作为编程伙伴，实时协作和代码审查',
        opportunities: ['实时协作', '代码审查', '知识传递', '技能提升'],
        risks: ['过度依赖', '创造力限制', '团队动态', '质量控制']
      },
      {
        name: 'Natural Language Programming',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Explosive',
        applicationField: 'Intuitive Coding',
        description: '自然语言编程，通过人类语言直接生成代码',
        opportunities: ['编程民主化', '快速开发', '创意实现', '学习降门槛'],
        risks: ['精确性问题', '复杂逻辑处理', '调试困难', '性能优化']
      },
      {
        name: 'Code Generation from Design',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Design-to-Code',
        description: '从设计稿自动生成代码，连接设计和开发流程',
        opportunities: ['设计开发一体化', '快速原型', 'UI自动化', '团队协作'],
        risks: ['代码质量', '维护性', '设计限制', '工具依赖']
      },
      {
        name: 'AI Content Creation',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Explosive',
        applicationField: 'Creative Industries',
        description: 'AI驱动的内容创作，包括文本、图像、视频',
        opportunities: ['创作效率', '个性化内容', '成本降低', '创意激发'],
        risks: ['版权争议', '原创性', '就业冲击', '质量控制']
      },
      {
        name: 'Midjourney',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Rising',
        applicationField: 'AI Art Generation',
        description: 'AI图像生成工具，创造艺术作品',
        opportunities: ['艺术创作', '设计辅助', '营销素材', '个性化定制'],
        risks: ['版权纠纷', '艺术价值', '伦理争议', '商业模式']
      },
      {
        name: 'DALL-E',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Image Generation',
        description: 'OpenAI的文本到图像生成模型',
        opportunities: ['视觉设计', '广告创意', '教育插图', '产品原型'],
        risks: ['内容审核', '误用风险', '技术限制', '成本控制']
      },
      {
        name: 'Stable Diffusion',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Rising',
        applicationField: 'Open Source AI Art',
        description: '开源的图像生成模型，可本地部署',
        opportunities: ['开源生态', '定制化', '隐私保护', '成本优势'],
        risks: ['滥用风险', '内容监管', '技术门槛', '质量差异']
      },
      {
        name: 'AI Video Generation',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Critical',
        trendPrediction: 'Explosive',
        applicationField: 'Video Production',
        description: 'AI生成视频内容，包括深度伪造技术',
        opportunities: ['视频制作', '教育内容', '娱乐产业', '营销创新'],
        risks: ['深度伪造', '信息安全', '伦理问题', '法律风险']
      },
      {
        name: 'Sora',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Critical',
        trendPrediction: 'Explosive',
        applicationField: 'Text-to-Video',
        description: 'OpenAI的文本到视频生成模型',
        opportunities: ['影视制作', '广告创意', '教育培训', '虚拟现实'],
        risks: ['深度伪造', '版权问题', '社会影响', '技术滥用']
      },
      {
        name: 'AI Voice Cloning',
        relevanceScore: 8,
        businessValue: 'Medium',
        riskLevel: 'Critical',
        trendPrediction: 'Rising',
        applicationField: 'Speech Synthesis',
        description: 'AI语音克隆技术，模拟真实人声',
        opportunities: ['配音服务', '个性化助手', '语言学习', '无障碍技术'],
        risks: ['身份伪造', '诈骗风险', '隐私侵犯', '法律争议']
      },
      {
        name: 'AI Customer Service',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Customer Support',
        description: 'AI驱动的客户服务系统',
        opportunities: ['成本降低', '24/7服务', '多语言支持', '个性化体验'],
        risks: ['服务质量', '人情味缺失', '复杂问题处理', '就业影响']
      }
    ]
  },
  {
    name: 'AI Ethics & Risk Management',
    totalKeywords: 32,
    avgRelevanceScore: 8.9,
    highRiskCount: 18,
    keywords: [
      {
        name: 'AI Alignment',
        relevanceScore: 10,
        businessValue: 'High',
        riskLevel: 'Critical',
        trendPrediction: 'Explosive',
        applicationField: 'AI Safety',
        description: 'AI系统与人类价值观的对齐问题',
        opportunities: ['安全AI开发', '风险管理', '监管合规', '信任建立'],
        risks: ['对齐失败', '价值冲突', '控制问题', '存在风险']
      },
      {
        name: 'AI Hallucination',
        relevanceScore: 9,
        businessValue: 'Medium',
        riskLevel: 'High',
        trendPrediction: 'Rising',
        applicationField: 'AI Reliability',
        description: 'AI模型产生虚假或不准确信息的现象',
        opportunities: ['检测技术', '质量控制', '可靠性提升', '风险评估'],
        risks: ['信息误导', '决策错误', '信任危机', '责任问题']
      },
      {
        name: 'Deepfake Detection',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Critical',
        trendPrediction: 'Explosive',
        applicationField: 'Content Verification',
        description: '深度伪造内容的检测和识别技术',
        opportunities: ['安全服务', '内容验证', '媒体保护', '法律支持'],
        risks: ['技术军备竞赛', '检测滞后', '误判风险', '隐私问题']
      },
      {
        name: 'AI Bias',
        relevanceScore: 9,
        businessValue: 'Medium',
        riskLevel: 'High',
        trendPrediction: 'Rising',
        applicationField: 'Fairness & Ethics',
        description: 'AI系统中的偏见和歧视问题',
        opportunities: ['公平性技术', '多样性服务', '合规解决方案', '社会责任'],
        risks: ['歧视风险', '社会不公', '法律责任', '声誉损害']
      },
      {
        name: 'Explainable AI',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'AI Interpretability',
        description: '可解释AI技术，提高AI决策透明度',
        opportunities: ['监管合规', '信任建立', '决策支持', '风险管理'],
        risks: ['技术复杂性', '性能权衡', '实施成本', '标准缺失']
      },
      {
        name: 'AI Governance',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Explosive',
        applicationField: 'Policy & Regulation',
        description: 'AI治理框架和监管政策',
        opportunities: ['合规服务', '政策咨询', '标准制定', '风险评估'],
        risks: ['监管不确定性', '合规成本', '创新限制', '国际分歧']
      },
      {
        name: 'AI Privacy',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Rising',
        applicationField: 'Data Protection',
        description: 'AI系统中的隐私保护和数据安全',
        opportunities: ['隐私技术', '数据保护', '合规解决方案', '信任服务'],
        risks: ['数据泄露', '隐私侵犯', '监管处罚', '用户流失']
      },
      {
        name: 'Federated Learning',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Privacy-Preserving ML',
        description: '联邦学习技术，保护数据隐私的分布式训练',
        opportunities: ['隐私保护', '数据协作', '边缘计算', '合规训练'],
        risks: ['技术复杂性', '通信开销', '安全挑战', '标准化问题']
      },
      {
        name: 'AI Watermarking',
        relevanceScore: 7,
        businessValue: 'Medium',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Content Authentication',
        description: 'AI生成内容的水印和溯源技术',
        opportunities: ['内容验证', '版权保护', '溯源服务', '信任机制'],
        risks: ['技术绕过', '实施成本', '用户体验', '标准缺失']
      },
      {
        name: 'Constitutional AI',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'AI Safety',
        description: '基于宪法原则的AI训练方法',
        opportunities: ['安全AI', '价值对齐', '可控性', '信任建立'],
        risks: ['实施复杂性', '价值定义', '文化差异', '技术限制']
      }
    ]
  },
  {
    name: 'Emerging AI Technologies',
    totalKeywords: 28,
    avgRelevanceScore: 8.3,
    highRiskCount: 10,
    keywords: [
      {
        name: 'AGI (Artificial General Intelligence)',
        relevanceScore: 10,
        businessValue: 'High',
        riskLevel: 'Critical',
        trendPrediction: 'Explosive',
        applicationField: 'General AI',
        description: '通用人工智能，具备人类级别的认知能力',
        opportunities: ['革命性应用', '生产力飞跃', '科学突破', '社会变革'],
        risks: ['存在风险', '控制问题', '就业冲击', '社会动荡']
      },
      {
        name: 'Multimodal AI',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Explosive',
        applicationField: 'Cross-Modal Understanding',
        description: '多模态AI，整合文本、图像、音频等多种数据',
        opportunities: ['全面理解', '丰富交互', '应用扩展', '用户体验'],
        risks: ['复杂性增加', '计算需求', '数据整合', '隐私风险']
      },
      {
        name: 'AI Agents',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'High',
        trendPrediction: 'Explosive',
        applicationField: 'Autonomous Systems',
        description: '自主AI代理，能够独立执行复杂任务',
        opportunities: ['自动化升级', '智能助手', '决策支持', '效率提升'],
        risks: ['自主性风险', '责任归属', '控制问题', '意外行为']
      },
      {
        name: 'Retrieval Augmented Generation',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Knowledge Integration',
        description: '检索增强生成，结合外部知识库的AI生成',
        opportunities: ['知识整合', '准确性提升', '实时更新', '专业应用'],
        risks: ['数据质量', '检索效率', '知识冲突', '维护成本']
      },
      {
        name: 'Chain of Thought',
        relevanceScore: 8,
        businessValue: 'Medium',
        riskLevel: 'Low',
        trendPrediction: 'Rising',
        applicationField: 'Reasoning Enhancement',
        description: '思维链技术，提高AI推理能力',
        opportunities: ['推理改进', '问题解决', '教育应用', '决策支持'],
        risks: ['推理错误', '计算开销', '复杂性管理', '可解释性']
      },
      {
        name: 'Few-shot Learning',
        relevanceScore: 8,
        businessValue: 'High',
        riskLevel: 'Medium',
        trendPrediction: 'Rising',
        applicationField: 'Efficient Learning',
        description: '少样本学习，用少量数据训练AI模型',
        opportunities: ['数据效率', '快速适应', '成本降低', '应用扩展'],
        risks: ['泛化能力', '数据质量', '过拟合', '性能限制']
      },
      {
        name: 'Neural Architecture Search',
        relevanceScore: 7,
        businessValue: 'Medium',
        riskLevel: 'Low',
        trendPrediction: 'Stable',
        applicationField: 'Model Optimization',
        description: '神经架构搜索，自动设计神经网络结构',
        opportunities: ['架构优化', '性能提升', '自动化设计', '效率改进'],
        risks: ['计算成本', '搜索空间', '局部最优', '实施复杂性']
      },
      {
        name: 'Prompt Engineering',
        relevanceScore: 9,
        businessValue: 'High',
        riskLevel: 'Low',
        trendPrediction: 'Rising',
        applicationField: 'AI Interaction',
        description: '提示工程，优化与AI模型的交互方式',
        opportunities: ['性能优化', '应用定制', '用户体验', '成本控制'],
        risks: ['技能门槛', '模型依赖', '提示泄露', '一致性问题']
      },
      {
        name: 'AI Model Compression',
        relevanceScore: 7,
        businessValue: 'High',
        riskLevel: 'Low',
        trendPrediction: 'Rising',
        applicationField: 'Model Efficiency',
        description: 'AI模型压缩技术，减少模型大小和计算需求',
        opportunities: ['边缘部署', '成本降低', '速度提升', '能耗减少'],
        risks: ['性能损失', '压缩质量', '技术复杂性', '兼容性问题']
      },
      {
        name: 'Quantum Machine Learning',
        relevanceScore: 6,
        businessValue: 'Medium',
        riskLevel: 'High',
        trendPrediction: 'Rising',
        applicationField: 'Quantum Computing',
        description: '量子机器学习，结合量子计算和AI',
        opportunities: ['计算突破', '算法创新', '优化问题', '科学研究'],
        risks: ['技术不成熟', '硬件限制', '人才稀缺', '投资风险']
      }
    ]
  }
];

// 生成AI黑天鹅趋势数据
export const generateAITrendData = (): TrendData[] => {
  const allAIKeywords = aiBlackSwanKeywords.flatMap(category => 
    category.keywords.map(keyword => ({
      keyword: keyword.name,
      searchVolume: Math.floor(Math.random() * 1500000) + 200000,
      changePercentage: keyword.trendPrediction === 'Explosive' ? 
        Math.floor(Math.random() * 800) + 200 :
        keyword.trendPrediction === 'Rising' ?
        Math.floor(Math.random() * 300) + 50 :
        Math.floor(Math.random() * 100) + 10,
      isExploding: keyword.trendPrediction === 'Explosive' || keyword.riskLevel === 'Critical',
      category: category.name,
      chartData: generateAIChartData(keyword.trendPrediction),
      peakDate: new Date(2022 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      currentTrend: keyword.trendPrediction === 'Explosive' || keyword.trendPrediction === 'Rising' ? 'up' : 
                   keyword.trendPrediction === 'Declining' ? 'down' : 'stable'
    }))
  );

  return allAIKeywords;
};

const generateAIChartData = (trendPrediction: string): { date: string; value: number }[] => {
  const data: { date: string; value: number }[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let year = 2004; year <= currentYear; year++) {
    let value: number;
    const progress = (year - 2004) / (currentYear - 2004);
    
    // AI相关关键词在2020年后开始快速增长
    const aiBoostYear = 2020;
    const aiBoostProgress = Math.max(0, (year - aiBoostYear) / (currentYear - aiBoostYear));
    
    switch (trendPrediction) {
      case 'Explosive':
        if (year < aiBoostYear) {
          value = 5 + progress * 15;
        } else {
          value = 20 + aiBoostProgress * 400 + Math.random() * 50;
        }
        break;
      case 'Rising':
        if (year < aiBoostYear) {
          value = 10 + progress * 20;
        } else {
          value = 30 + aiBoostProgress * 150 + Math.random() * 30;
        }
        break;
      case 'Declining':
        value = year < aiBoostYear ? 
          40 + progress * 30 - (progress * progress) * 20 :
          70 - aiBoostProgress * 40;
        break;
      default: // Stable
        value = year < aiBoostYear ?
          15 + progress * 25 + Math.sin(progress * Math.PI * 2) * 10 :
          40 + aiBoostProgress * 30 + Math.sin(aiBoostProgress * Math.PI * 4) * 15;
    }
    
    data.push({
      date: `${year}-01-01`,
      value: Math.max(0, Math.round(value))
    });
  }
  
  return data;
};