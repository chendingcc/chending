import React from 'react';
import { Calendar, User, ArrowRight, TrendingUp, Eye, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  imageUrl: string;
  views: number;
  featured?: boolean;
}

export const BlogSection: React.FC = () => {
  // Mock blog data - 这些将来可以从Supabase获取
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'ChatGPT现象解析：为什么对话式AI成为2023年最大黑天鹅',
      excerpt: '从2022年11月发布到2023年成为全球现象，ChatGPT的爆发式增长背后隐藏着什么规律？我们深入分析这个改变世界的AI产品如何从技术突破转化为社会现象，以及它给我们带来的启示。',
      author: 'Dr. Sarah Chen',
      publishDate: '2024-01-20',
      readTime: '12 min read',
      category: 'AI Revolution',
      imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 28500,
      featured: true
    },
    {
      id: '2',
      title: '远程工作革命：疫情如何永久改变了工作模式',
      excerpt: '2020年3月，"remote work"搜索量暴增2000%。这不仅仅是疫情的临时应对，而是一场工作方式的根本性变革。我们分析了远程工作从边缘概念到主流趋势的完整路径，以及它如何重塑了整个就业市场。',
      author: 'Emma Wilson',
      publishDate: '2024-01-18',
      readTime: '10 min read',
      category: 'Future of Work',
      imageUrl: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 19200,
    },
    {
      id: '3',
      title: 'TikTok崛起密码：短视频如何颠覆社交媒体格局',
      excerpt: '从2018年的小众应用到2020年全球下载量第一，TikTok的成功绝非偶然。我们深度剖析TikTok如何利用算法创新、内容生态和用户心理，在短短两年内挑战Facebook和YouTube的霸主地位，重新定义了社交媒体的未来。',
      author: 'Lisa Zhang',
      publishDate: '2024-01-16',
      readTime: '9 min read',
      category: 'Social Media',
      imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 22800,
    },
    {
      id: '4',
      title: '电动汽车拐点：特斯拉如何引爆绿色交通革命',
      excerpt: '2020年，"electric vehicle"搜索量增长400%，特斯拉股价暴涨743%。这场电动汽车革命的背后，是技术成熟、政策推动和消费者意识觉醒的完美风暴。我们分析了电动汽车从小众产品到主流选择的关键转折点。',
      author: 'Dr. James Park',
      publishDate: '2024-01-14',
      readTime: '11 min read',
      category: 'Green Technology',
      imageUrl: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 16700,
    },
    {
      id: '5',
      title: 'NFT狂潮解密：数字艺术如何创造千亿美元市场',
      excerpt: '2021年，"NFT"从几乎无人知晓到全球热搜，市场规模从零增长到250亿美元。这场数字艺术革命背后的驱动力是什么？我们深入分析NFT如何重新定义数字所有权，以及为什么它能在短时间内吸引全球关注。',
      author: 'Alex Thompson',
      publishDate: '2024-01-12',
      readTime: '8 min read',
      category: 'Digital Assets',
      imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 31200,
    },
    {
      id: '6',
      title: '口罩经济学：一个防护用品如何重塑全球供应链',
      excerpt: '2020年初，"face mask"搜索量在一个月内增长5000%。一个简单的医疗防护用品如何成为全球最紧缺的商品？我们分析了口罩从医疗用品到日常必需品的转变过程，以及它如何暴露和重塑了全球供应链的脆弱性。',
      author: 'Michael Rodriguez',
      publishDate: '2024-01-10',
      readTime: '7 min read',
      category: 'Supply Chain',
      imageUrl: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 14900,
    },
    {
      id: '7',
      title: 'GameStop传奇：散户如何撼动华尔街巨头',
      excerpt: '2021年1月，"GameStop stock"搜索量暴增3000%，一群Reddit用户掀起了金融史上最戏剧性的逼空大战。我们深入分析这场"散户vs华尔街"战争的来龙去脉，以及它如何永久改变了股票市场的游戏规则。',
      author: 'David Kim',
      publishDate: '2024-01-08',
      readTime: '13 min read',
      category: 'Financial Markets',
      imageUrl: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 25600,
    },
    {
      id: '8',
      title: 'Zoom现象：视频会议如何成为疫情时代的生命线',
      excerpt: '2020年3月，Zoom日活用户从1000万暴增至3亿，股价上涨396%。一个企业级视频会议软件如何在几个月内成为全球家喻户晓的品牌？我们分析了Zoom如何抓住历史机遇，从B2B工具转变为社会基础设施。',
      author: 'Rachel Green',
      publishDate: '2024-01-06',
      readTime: '9 min read',
      category: 'Technology',
      imageUrl: 'https://images.pexels.com/photos/4226263/pexels-photo-4226263.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 18300,
    },
    {
      id: '9',
      title: '比特币突破：数字黄金如何从极客玩具变成投资主流',
      excerpt: '从2020年的3800美元到2021年的69000美元，比特币用18个月时间完成了从边缘资产到机构投资标的的华丽转身。我们深度解析比特币这轮牛市背后的宏观经济逻辑、机构采用趋势，以及它如何重新定义了价值存储的概念。',
      author: 'Robert Chen',
      publishDate: '2024-01-04',
      readTime: '14 min read',
      category: 'Cryptocurrency',
      imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 33400,
    },
    {
      id: '10',
      title: '植物肉革命：Beyond Meat如何重新定义食物的未来',
      excerpt: '2019年，Beyond Meat上市首日暴涨163%，"plant based meat"搜索量增长800%。一个植物蛋白产品如何在传统肉类市场中杀出重围？我们分析了植物肉从实验室概念到超市货架的完整路径，以及它如何迎合了健康、环保和可持续发展的时代需求。',
      author: 'Dr. Maria Santos',
      publishDate: '2024-01-02',
      readTime: '10 min read',
      category: 'Food Innovation',
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 12100,
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI Trends': 'bg-purple-100 text-purple-800',
      'Supply Chain': 'bg-blue-100 text-blue-800',
      'Cryptocurrency': 'bg-yellow-100 text-yellow-800',
      'Future of Work': 'bg-green-100 text-green-800',
      'Climate Tech': 'bg-emerald-100 text-emerald-800',
      'Social Media': 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trend Insights & Analysis
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            深度分析全球趋势变化，发现黑天鹅事件的早期信号，为您的决策提供数据支持
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(featuredPost.category)}`}>
                      {featuredPost.category}
                    </span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(featuredPost.publishDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {featuredPost.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {featuredPost.views.toLocaleString()}
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Read More
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye size={12} />
                    {post.views.toLocaleString()}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.publishDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </div>
                </div>
                
                <button className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  Read More
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
};