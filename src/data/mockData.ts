import { TrendData, SearchSuggestion, BlackSwanCategory } from '../types';
import { generateAITrendData } from './aiBlackSwanData';

// 扩展的黑天鹅关键词分类数据库 - 1000+关键词
export const blackSwanCategories: BlackSwanCategory[] = [
  {
    name: 'Pandemic & Health',
    keywords: [
      'covid 19', 'coronavirus', 'pandemic', 'lockdown', 'quarantine', 'social distancing', 
      'face mask', 'hand sanitizer', 'vaccine', 'pfizer vaccine', 'moderna vaccine', 
      'booster shot', 'omicron variant', 'delta variant', 'pcr test', 'rapid test',
      'contact tracing', 'herd immunity', 'flatten the curve', 'ventilator shortage',
      'hospital capacity', 'icu beds', 'healthcare workers', 'frontline workers',
      'telemedicine', 'virtual doctor', 'health screening', 'temperature check',
      'immunity passport', 'vaccine passport', 'covid certificate', 'travel restrictions',
      'border closure', 'flight cancellation', 'cruise ship outbreak', 'superspreader event',
      'long covid', 'covid symptoms', 'covid recovery', 'covid treatment', 'covid deaths',
      'covid statistics', 'covid variants', 'covid mutations', 'covid transmission',
      'covid prevention', 'covid guidelines', 'covid protocols', 'covid testing',
      'covid isolation', 'covid quarantine', 'covid contact', 'covid exposure',
      'covid vaccine side effects', 'vaccine hesitancy', 'vaccine mandate', 'vaccine rollout',
      'vaccine distribution', 'vaccine efficacy', 'vaccine breakthrough', 'vaccine booster',
      'mrna vaccine', 'johnson vaccine', 'astrazeneca vaccine', 'novavax vaccine',
      'vaccine appointment', 'vaccine availability', 'vaccine eligibility', 'vaccine priority',
      'mask mandate', 'mask shortage', 'n95 mask', 'surgical mask', 'cloth mask',
      'face shield', 'ppe shortage', 'medical supplies', 'ventilator production',
      'oxygen shortage', 'hospital bed shortage', 'medical staff shortage', 'nurse shortage',
      'doctor shortage', 'healthcare crisis', 'medical emergency', 'health system collapse',
      'public health emergency', 'health department', 'cdc guidelines', 'who recommendations',
      'epidemiology', 'infectious disease', 'viral load', 'antibody test', 'serology test',
      'covid antibodies', 'natural immunity', 'acquired immunity', 'immune response',
      'cytokine storm', 'covid pneumonia', 'covid hospitalization', 'covid icu',
      'covid ventilator', 'covid mortality', 'excess deaths', 'covid statistics',
      'pandemic preparedness', 'pandemic response', 'pandemic recovery', 'post pandemic',
      'endemic phase', 'new normal', 'covid fatigue', 'pandemic stress', 'mental health pandemic'
    ]
  },
  {
    name: 'Remote Work & Education',
    keywords: [
      'remote work', 'work from home', 'wfh', 'zoom meeting', 'video conference',
      'zoom fatigue', 'virtual meeting', 'online collaboration', 'digital nomad',
      'home office setup', 'ergonomic chair', 'standing desk', 'webcam shortage',
      'microphone upgrade', 'internet speed', 'vpn usage', 'cloud storage',
      'online learning', 'virtual classroom', 'e-learning platform', 'zoom school',
      'homeschooling', 'distance learning', 'educational technology', 'learning management system',
      'virtual graduation', 'online exam', 'proctoring software', 'digital textbook',
      'student engagement', 'screen time', 'digital divide', 'internet access',
      'laptop shortage', 'tablet for education', 'chromebook demand', 'wifi hotspot',
      'hybrid work', 'flexible work', 'remote team', 'virtual team', 'distributed team',
      'asynchronous work', 'synchronous work', 'remote collaboration', 'digital workspace',
      'virtual office', 'coworking space', 'home productivity', 'work life balance',
      'remote management', 'virtual leadership', 'remote culture', 'team building online',
      'virtual events', 'online networking', 'digital communication', 'slack usage',
      'microsoft teams', 'google meet', 'webex', 'gotomeeting', 'skype business',
      'screen sharing', 'file sharing', 'cloud collaboration', 'project management tools',
      'trello', 'asana', 'monday.com', 'notion', 'airtable', 'basecamp',
      'time tracking', 'productivity apps', 'focus apps', 'distraction blocking',
      'remote onboarding', 'virtual training', 'online workshops', 'webinars',
      'virtual conferences', 'online summits', 'digital events', 'live streaming',
      'remote hiring', 'virtual interviews', 'online recruitment', 'digital hr',
      'employee monitoring', 'productivity tracking', 'remote security', 'vpn security',
      'home network security', 'cybersecurity remote', 'data protection remote',
      'remote access', 'cloud computing', 'saas tools', 'digital transformation',
      'paperless office', 'digital documents', 'electronic signatures', 'docusign',
      'online education', 'mooc', 'coursera', 'udemy', 'khan academy', 'edx',
      'virtual university', 'online degree', 'remote learning', 'blended learning',
      'flipped classroom', 'personalized learning', 'adaptive learning', 'ai tutoring',
      'educational apps', 'learning apps', 'study apps', 'language learning apps',
      'duolingo', 'babbel', 'rosetta stone', 'online tutoring', 'virtual tutoring',
      'homework help', 'study groups online', 'virtual study', 'online library',
      'digital resources', 'educational videos', 'youtube education', 'ted talks',
      'online courses', 'certification online', 'skill development', 'professional development'
    ]
  },
  {
    name: 'Supply Chain & Logistics',
    keywords: [
      'supply chain crisis', 'supply chain disruption', 'semiconductor shortage', 'chip shortage',
      'container shortage', 'shipping delay', 'port congestion', 'freight cost',
      'suez canal blockage', 'ever given', 'global shipping', 'logistics crisis',
      'raw material shortage', 'lumber shortage', 'steel shortage', 'plastic shortage',
      'food supply chain', 'meat shortage', 'toilet paper shortage', 'cleaning supplies shortage',
      'medical supplies shortage', 'ppe shortage', 'ventilator production', 'mask production',
      'just in time manufacturing', 'inventory management', 'stockpiling', 'panic buying',
      'empty shelves', 'out of stock', 'backorder', 'lead time increase',
      'nearshoring', 'reshoring', 'supply chain resilience', 'diversification strategy',
      'supply chain visibility', 'supply chain transparency', 'supply chain risk',
      'supply chain management', 'logistics management', 'warehouse management',
      'inventory shortage', 'stock shortage', 'material shortage', 'component shortage',
      'manufacturing delay', 'production delay', 'factory shutdown', 'plant closure',
      'labor shortage', 'worker shortage', 'truck driver shortage', 'pilot shortage',
      'shipping container', 'cargo ship', 'freight train', 'air cargo', 'ocean freight',
      'land transportation', 'last mile delivery', 'delivery delay', 'shipping cost',
      'fuel cost', 'oil price', 'gas price', 'energy cost', 'transportation cost',
      'customs delay', 'border delay', 'trade restrictions', 'import restrictions',
      'export restrictions', 'tariff impact', 'trade war impact', 'sanctions impact',
      'global trade', 'international trade', 'cross border trade', 'trade routes',
      'shipping routes', 'supply routes', 'distribution network', 'logistics network',
      'warehouse capacity', 'storage capacity', 'fulfillment center', 'distribution center',
      'cold chain', 'temperature controlled', 'perishable goods', 'food logistics',
      'pharmaceutical logistics', 'medical device supply', 'automotive supply chain',
      'electronics supply chain', 'textile supply chain', 'fashion supply chain',
      'retail supply chain', 'grocery supply chain', 'restaurant supply chain',
      'construction materials', 'building supplies', 'home improvement supplies',
      'industrial supplies', 'manufacturing supplies', 'office supplies', 'school supplies',
      'medical supplies', 'hospital supplies', 'laboratory supplies', 'research supplies',
      'agricultural supplies', 'farming supplies', 'livestock supplies', 'pet supplies',
      'automotive parts', 'spare parts', 'replacement parts', 'maintenance supplies',
      'packaging materials', 'shipping materials', 'protective packaging', 'sustainable packaging',
      'recycling supply chain', 'waste management', 'circular economy', 'green logistics',
      'carbon footprint logistics', 'sustainable transportation', 'electric delivery',
      'drone delivery', 'autonomous delivery', 'robotic fulfillment', 'ai logistics'
    ]
  },
  {
    name: 'Finance & Investment',
    keywords: [
      'stock market crash', 'market volatility', 'circuit breaker', 'trading halt',
      'gamestop squeeze', 'short squeeze', 'reddit wallstreetbets', 'meme stocks',
      'robinhood trading', 'retail investors', 'day trading', 'options trading',
      'cryptocurrency boom', 'bitcoin surge', 'ethereum rise', 'dogecoin pump',
      'nft craze', 'digital assets', 'defi explosion', 'yield farming',
      'inflation hedge', 'commodity prices', 'gold rush', 'silver squeeze',
      'real estate boom', 'housing shortage', 'mortgage rates', 'refinancing surge',
      'stimulus check', 'unemployment benefits', 'ppp loan', 'economic relief',
      'federal reserve policy', 'quantitative easing', 'interest rates', 'money printing',
      'debt ceiling', 'government spending', 'fiscal policy', 'economic recovery',
      'market manipulation', 'pump and dump', 'insider trading', 'securities fraud',
      'ponzi scheme', 'pyramid scheme', 'investment scam', 'crypto scam',
      'rug pull', 'exit scam', 'exchange hack', 'wallet hack', 'defi hack',
      'smart contract exploit', 'flash loan attack', 'arbitrage trading', 'high frequency trading',
      'algorithmic trading', 'robo advisor', 'automated investing', 'passive investing',
      'index fund', 'etf boom', 'spac boom', 'ipo surge', 'direct listing',
      'venture capital', 'private equity', 'hedge fund', 'mutual fund', 'pension fund',
      'sovereign wealth fund', 'family office', 'wealth management', 'asset management',
      'portfolio management', 'risk management', 'diversification', 'asset allocation',
      'rebalancing', 'dollar cost averaging', 'value investing', 'growth investing',
      'momentum investing', 'contrarian investing', 'technical analysis', 'fundamental analysis',
      'market sentiment', 'investor sentiment', 'fear and greed', 'market psychology',
      'behavioral finance', 'cognitive bias', 'herd mentality', 'fomo investing',
      'panic selling', 'buy the dip', 'diamond hands', 'paper hands', 'hodl',
      'to the moon', 'stonks', 'apes together strong', 'this is the way',
      'financial literacy', 'investment education', 'trading education', 'market education',
      'personal finance', 'budgeting', 'saving', 'emergency fund', 'retirement planning',
      'tax planning', 'estate planning', 'insurance planning', 'financial planning',
      'credit score', 'debt management', 'loan refinancing', 'mortgage refinancing',
      'student loan forgiveness', 'credit card debt', 'bankruptcy', 'foreclosure',
      'eviction moratorium', 'rent relief', 'mortgage relief', 'financial hardship',
      'economic inequality', 'wealth gap', 'income inequality', 'social mobility',
      'universal basic income', 'minimum wage', 'living wage', 'gig economy',
      'freelance economy', 'creator economy', 'sharing economy', 'platform economy',
      'fintech', 'neobank', 'challenger bank', 'digital bank', 'mobile banking',
      'online banking', 'contactless payment', 'digital wallet', 'mobile payment',
      'buy now pay later', 'bnpl', 'peer to peer lending', 'crowdfunding',
      'kickstarter', 'indiegogo', 'patreon', 'onlyfans', 'substack', 'newsletter monetization'
    ]
  },
  {
    name: 'Technology & Digitalization',
    keywords: [
      'ai chatbot', 'chatgpt', 'artificial intelligence', 'machine learning',
      'automation surge', 'robot delivery', 'contactless technology', 'qr code payment',
      'digital transformation', 'cloud migration', 'saas adoption', 'cybersecurity threats',
      'data breach', 'ransomware attack', 'zoom bombing', 'phishing increase',
      'privacy concerns', 'data protection', 'gdpr compliance', 'cookie consent',
      'social media addiction', 'screen time increase', 'digital detox', 'mental health apps',
      'fitness apps', 'meditation apps', 'sleep tracking', 'health monitoring',
      'smart home devices', 'alexa usage', 'google home', 'iot security',
      '5g rollout', 'edge computing', 'quantum computing', 'blockchain adoption',
      'metaverse hype', 'virtual reality', 'augmented reality', 'digital twins',
      'deep learning', 'neural networks', 'natural language processing', 'computer vision',
      'facial recognition', 'voice recognition', 'speech synthesis', 'text to speech',
      'image generation', 'video generation', 'deepfake', 'synthetic media',
      'generative ai', 'large language model', 'transformer model', 'gpt model',
      'bert model', 'stable diffusion', 'midjourney', 'dall e', 'ai art',
      'ai writing', 'ai coding', 'github copilot', 'code generation', 'low code',
      'no code', 'citizen developer', 'democratization of ai', 'ai ethics',
      'ai bias', 'algorithmic bias', 'explainable ai', 'responsible ai',
      'ai governance', 'ai regulation', 'ai safety', 'ai alignment',
      'artificial general intelligence', 'agi', 'superintelligence', 'singularity',
      'robotics', 'autonomous vehicles', 'self driving cars', 'tesla autopilot',
      'waymo', 'cruise', 'robotaxi', 'delivery robot', 'warehouse robot',
      'industrial robot', 'collaborative robot', 'cobot', 'robot process automation',
      'rpa', 'intelligent automation', 'hyperautomation', 'digital worker',
      'virtual assistant', 'chatbot', 'voicebot', 'conversational ai',
      'smart speaker', 'voice interface', 'gesture control', 'brain computer interface',
      'neuralink', 'biometric authentication', 'fingerprint scanner', 'face unlock',
      'iris scanner', 'voice authentication', 'behavioral biometrics', 'zero trust',
      'passwordless', 'multi factor authentication', 'single sign on', 'identity management',
      'access management', 'privileged access', 'endpoint security', 'network security',
      'cloud security', 'application security', 'data security', 'information security',
      'cyber threat', 'cyber attack', 'cyber warfare', 'nation state attack',
      'advanced persistent threat', 'apt', 'malware', 'virus', 'trojan',
      'spyware', 'adware', 'rootkit', 'botnet', 'ddos attack', 'sql injection',
      'cross site scripting', 'buffer overflow', 'zero day exploit', 'vulnerability',
      'patch management', 'security update', 'antivirus', 'firewall', 'intrusion detection',
      'security monitoring', 'threat intelligence', 'incident response', 'forensics',
      'penetration testing', 'ethical hacking', 'bug bounty', 'security audit',
      'compliance', 'regulatory compliance', 'data governance', 'privacy by design'
    ]
  },
  {
    name: 'Consumer Behavior Changes',
    keywords: [
      'online shopping surge', 'e-commerce boom', 'amazon delivery', 'same day delivery',
      'contactless delivery', 'curbside pickup', 'buy online pickup in store', 'bopis',
      'food delivery explosion', 'uber eats', 'doordash', 'grubhub',
      'meal kit delivery', 'grocery delivery', 'instacart', 'fresh direct',
      'streaming services', 'netflix binge', 'disney plus', 'cord cutting',
      'home entertainment', 'gaming surge', 'nintendo switch', 'ps5 shortage',
      'home improvement', 'diy projects', 'gardening boom', 'home gym equipment',
      'exercise bike', 'peloton bike', 'home fitness', 'yoga mat shortage',
      'baking bread', 'sourdough starter', 'cooking at home', 'kitchen appliances',
      'air fryer', 'instant pot', 'coffee machine', 'home brewing',
      'subscription economy', 'subscription box', 'monthly box', 'curated box',
      'meal subscription', 'beauty box', 'clothing subscription', 'book subscription',
      'streaming subscription', 'software subscription', 'saas subscription', 'membership model',
      'loyalty program', 'rewards program', 'cashback', 'points system',
      'personalization', 'recommendation engine', 'ai recommendation', 'custom products',
      'made to order', 'on demand manufacturing', 'mass customization', '3d printing',
      'direct to consumer', 'd2c brand', 'brand direct', 'cutting middleman',
      'social commerce', 'social shopping', 'instagram shopping', 'facebook marketplace',
      'tiktok shopping', 'live shopping', 'live streaming commerce', 'shoppable video',
      'influencer marketing', 'micro influencer', 'nano influencer', 'brand ambassador',
      'user generated content', 'ugc', 'customer reviews', 'social proof',
      'word of mouth', 'viral marketing', 'organic growth', 'community building',
      'brand community', 'customer community', 'online community', 'forum',
      'discord server', 'telegram group', 'whatsapp group', 'facebook group',
      'reddit community', 'subreddit', 'online tribe', 'digital tribe',
      'creator economy', 'content creator', 'youtube creator', 'tiktok creator',
      'instagram creator', 'twitch streamer', 'podcast creator', 'newsletter creator',
      'substack writer', 'medium writer', 'blog monetization', 'content monetization',
      'patreon creator', 'onlyfans creator', 'ko-fi', 'buy me coffee',
      'crowdfunding', 'kickstarter', 'indiegogo', 'gofundme', 'peer funding',
      'community funding', 'fan funding', 'supporter funding', 'patron model',
      'freemium model', 'premium model', 'tiered pricing', 'usage based pricing',
      'dynamic pricing', 'surge pricing', 'demand pricing', 'algorithmic pricing',
      'price comparison', 'price tracking', 'deal hunting', 'coupon hunting',
      'cashback apps', 'rebate apps', 'shopping apps', 'deal apps',
      'flash sale', 'daily deal', 'group buying', 'bulk buying',
      'wholesale buying', 'co-op buying', 'community buying', 'social buying',
      'sustainable shopping', 'eco friendly products', 'green products', 'organic products',
      'natural products', 'clean beauty', 'clean eating', 'plant based',
      'vegan products', 'cruelty free', 'fair trade', 'ethical shopping',
      'conscious consumption', 'mindful shopping', 'slow fashion', 'sustainable fashion',
      'second hand shopping', 'thrift shopping', 'vintage shopping', 'resale market',
      'circular economy', 'sharing economy', 'rental economy', 'access economy'
    ]
  },
  {
    name: 'Environment & Climate',
    keywords: [
      'climate change', 'global warming', 'carbon footprint', 'net zero emissions',
      'renewable energy', 'solar panels', 'wind energy', 'electric vehicles',
      'tesla stock', 'ev charging stations', 'battery technology', 'lithium shortage',
      'green hydrogen', 'carbon capture', 'sustainable investing', 'esg funds',
      'extreme weather', 'heat wave', 'wildfire season', 'hurricane damage',
      'flooding increase', 'drought conditions', 'water shortage', 'food security',
      'biodiversity loss', 'deforestation', 'ocean pollution', 'plastic waste',
      'circular economy', 'recycling crisis', 'waste management', 'composting',
      'sustainable fashion', 'fast fashion', 'eco friendly products', 'green building',
      'carbon tax', 'emissions trading', 'paris agreement', 'cop26 summit',
      'climate crisis', 'climate emergency', 'climate action', 'climate activism',
      'climate protest', 'extinction rebellion', 'fridays for future', 'greta thunberg',
      'climate science', 'climate research', 'climate data', 'climate modeling',
      'climate prediction', 'climate adaptation', 'climate mitigation', 'climate resilience',
      'sea level rise', 'ice cap melting', 'glacier retreat', 'permafrost thaw',
      'arctic warming', 'polar vortex', 'jet stream', 'ocean acidification',
      'coral bleaching', 'ecosystem collapse', 'species extinction', 'habitat loss',
      'conservation', 'wildlife protection', 'endangered species', 'protected areas',
      'national parks', 'marine reserves', 'forest conservation', 'reforestation',
      'afforestation', 'tree planting', 'carbon sequestration', 'natural carbon sinks',
      'renewable energy transition', 'energy transition', 'clean energy', 'green energy',
      'solar power', 'wind power', 'hydroelectric power', 'geothermal energy',
      'nuclear energy', 'fusion energy', 'energy storage', 'battery storage',
      'grid storage', 'smart grid', 'microgrid', 'distributed energy',
      'energy efficiency', 'energy conservation', 'energy saving', 'green technology',
      'cleantech', 'climate tech', 'environmental technology', 'sustainability tech',
      'electric mobility', 'e-mobility', 'electric cars', 'electric buses',
      'electric trucks', 'electric bikes', 'e-scooters', 'electric aviation',
      'sustainable aviation fuel', 'hydrogen fuel', 'fuel cells', 'alternative fuels',
      'biofuels', 'synthetic fuels', 'carbon neutral fuels', 'zero emission vehicles',
      'green transportation', 'sustainable transport', 'public transportation',
      'mass transit', 'bike sharing', 'car sharing', 'ride sharing',
      'micro mobility', 'active transportation', 'walkable cities', 'bike friendly cities',
      'green cities', 'sustainable cities', 'smart cities', 'eco cities',
      'urban planning', 'sustainable development', 'green infrastructure', 'nature based solutions',
      'green roofs', 'vertical gardens', 'urban forests', 'green spaces',
      'sustainable agriculture', 'organic farming', 'regenerative agriculture', 'precision agriculture',
      'vertical farming', 'indoor farming', 'hydroponic farming', 'aquaponic farming',
      'plant based diet', 'meat alternatives', 'lab grown meat', 'cultured meat',
      'alternative protein', 'insect protein', 'algae protein', 'sustainable food',
      'food waste reduction', 'zero waste', 'waste reduction', 'plastic reduction',
      'plastic alternatives', 'biodegradable packaging', 'compostable packaging', 'reusable packaging',
      'sustainable packaging', 'eco packaging', 'green packaging', 'minimal packaging'
    ]
  },
  {
    name: 'Social & Political',
    keywords: [
      'social unrest', 'protest movements', 'black lives matter', 'police reform',
      'election fraud claims', 'mail in voting', 'voter suppression', 'democracy crisis',
      'capitol riot', 'january 6', 'impeachment', 'political polarization',
      'fake news', 'misinformation', 'fact checking', 'social media censorship',
      'cancel culture', 'woke culture', 'culture wars', 'identity politics',
      'immigration crisis', 'border security', 'refugee crisis', 'asylum seekers',
      'trade war', 'tariffs', 'sanctions', 'geopolitical tensions',
      'china relations', 'russia sanctions', 'ukraine conflict', 'energy crisis',
      'inflation surge', 'cost of living', 'wage stagnation', 'income inequality',
      'housing crisis', 'homelessness', 'mental health crisis', 'opioid epidemic',
      'social justice', 'racial justice', 'criminal justice reform', 'prison reform',
      'police brutality', 'police accountability', 'defund police', 'police reform',
      'systemic racism', 'institutional racism', 'white privilege', 'racial equity',
      'diversity equity inclusion', 'dei', 'affirmative action', 'equal opportunity',
      'civil rights', 'human rights', 'voting rights', 'reproductive rights',
      'abortion rights', 'roe v wade', 'supreme court', 'constitutional rights',
      'free speech', 'first amendment', 'second amendment', 'gun control',
      'gun violence', 'mass shooting', 'school shooting', 'gun reform',
      'gun rights', 'nra', 'gun lobby', 'background checks', 'assault weapons ban',
      'lgbtq rights', 'gay rights', 'transgender rights', 'same sex marriage',
      'gender equality', 'pay gap', 'glass ceiling', 'metoo movement',
      'sexual harassment', 'workplace harassment', 'gender discrimination', 'sexism',
      'feminism', 'womens rights', 'reproductive health', 'family planning',
      'healthcare access', 'healthcare reform', 'universal healthcare', 'medicare for all',
      'prescription drug prices', 'insulin prices', 'healthcare costs', 'medical debt',
      'student debt', 'student loan crisis', 'education funding', 'school choice',
      'charter schools', 'public education', 'teacher shortage', 'education inequality',
      'digital divide', 'broadband access', 'internet equity', 'technology gap',
      'rural broadband', 'urban rural divide', 'infrastructure bill', 'infrastructure investment',
      'climate policy', 'environmental policy', 'green new deal', 'carbon pricing',
      'fossil fuel subsidies', 'renewable energy subsidies', 'energy policy', 'environmental justice',
      'food deserts', 'food insecurity', 'nutrition assistance', 'snap benefits',
      'welfare reform', 'social safety net', 'unemployment insurance', 'disability benefits',
      'social security', 'medicare', 'medicaid', 'affordable care act', 'obamacare',
      'healthcare mandate', 'insurance coverage', 'preexisting conditions', 'prescription coverage',
      'elder care', 'aging population', 'retirement crisis', 'pension crisis',
      'gig economy workers', 'labor rights', 'union organizing', 'collective bargaining',
      'minimum wage increase', 'living wage', 'worker protection', 'workplace safety',
      'occupational health', 'workers compensation', 'unemployment benefits', 'job training',
      'workforce development', 'skills training', 'vocational education', 'community college',
      'trade schools', 'apprenticeship programs', 'job placement', 'career services'
    ]
  },
  {
    name: 'Emerging Technology & Innovation',
    keywords: [
      'web3', 'dao', 'smart contracts', 'crypto wallet', 'metamask', 'opensea',
      'polygon', 'solana', 'cardano', 'binance smart chain', 'layer 2', 'ethereum 2.0',
      'proof of stake', 'mining ban', 'crypto regulation', 'cbdc', 'digital yuan',
      'stablecoin', 'tether', 'usdc', 'terra luna', 'celsius', 'ftx collapse',
      'space tourism', 'spacex', 'blue origin', 'virgin galactic', 'starlink',
      'satellite internet', 'mars mission', 'asteroid mining', 'space economy',
      'commercial space', 'rocket launch', 'space station', 'lunar mission',
      'mrna vaccine', 'gene therapy', 'crispr', 'personalized medicine', 'precision medicine',
      'biotech stocks', 'pharmaceutical', 'clinical trials', 'fda approval',
      'drug discovery', 'antibody therapy', 'immunotherapy', 'cancer treatment',
      'hydrogen fuel', 'fuel cell', 'energy storage', 'grid scale battery',
      'smart grid', 'microgrids', 'energy efficiency', 'heat pump',
      'geothermal energy', 'nuclear fusion', 'small modular reactor',
      'graphene', 'carbon fiber', 'advanced materials', 'nanotechnology',
      'biomaterials', 'smart materials', '3d printing materials', 'recycled materials',
      'additive manufacturing', '3d printing', 'industrial automation', 'cobots',
      'lights out manufacturing', 'mass customization', 'on demand manufacturing',
      'social commerce', 'live streaming shopping', 'influencer marketing',
      'direct to consumer', 'd2c brands', 'subscription economy', 'membership model',
      'loyalty programs', 'personalization', 'recommendation engine',
      'buy now pay later', 'bnpl', 'embedded finance', 'open banking',
      'challenger banks', 'neobanks', 'robo advisors', 'algorithmic trading',
      'high frequency trading', 'flash crash', 'market manipulation',
      'microlearning', 'adaptive learning', 'personalized learning', 'ai tutoring',
      'virtual labs', 'simulation learning', 'gamification', 'edtech',
      'coding bootcamp', 'online certification', 'skill based hiring',
      'digital health', 'health tech', 'wearable devices', 'remote monitoring',
      'ai diagnosis', 'robotic surgery', 'minimally invasive', 'regenerative medicine',
      'stem cell therapy', 'tissue engineering', 'organ printing',
      'autonomous vehicles', 'self driving cars', 'ride sharing', 'car sharing',
      'micro mobility', 'e scooters', 'e bikes', 'urban air mobility',
      'flying cars', 'hyperloop', 'maglev trains', 'electric aviation',
      'vertical farming', 'indoor farming', 'hydroponic', 'aeroponic',
      'precision agriculture', 'smart farming', 'agricultural drones',
      'farm automation', 'alternative protein', 'lab grown meat',
      'cloud gaming', 'game streaming', 'esports', 'virtual concerts',
      'virtual events', 'digital fashion', 'avatar', 'virtual influencer',
      'deepfake', 'synthetic media', 'ai generated content',
      'gig economy', 'freelance', 'remote first', 'hybrid work',
      'asynchronous work', 'four day work week', 'unlimited pto',
      'employee wellbeing', 'mental health benefits', 'diversity equity inclusion',
      'zero trust', 'passwordless', 'biometric authentication', 'multi factor authentication',
      'endpoint security', 'cloud security', 'iot security', 'supply chain security',
      'threat intelligence', 'incident response', 'security orchestration',
      'data sovereignty', 'digital rights', 'algorithmic accountability',
      'ai ethics', 'responsible ai', 'explainable ai', 'ai governance',
      'tech regulation', 'antitrust', 'platform liability', 'content moderation'
    ]
  }
];

// 生成更多黑天鹅关键词数据，确保有1000+个关键词
const generateMoreTrendData = (): TrendData[] => {
  // 从 blackSwanCategories 中提取所有关键词
  const allKeywords = blackSwanCategories.flatMap(category => category.keywords);
  
  const categories = [
    'Pandemic & Health', 'Remote Work & Education', 'Supply Chain & Logistics', 'Finance & Investment', 
    'Technology & Digitalization', 'Consumer Behavior Changes', 'Environment & Climate', 'Social & Political', 'Emerging Technology & Innovation'
  ];
  
  return allKeywords.map((keyword, index) => ({
    keyword,
    searchVolume: Math.floor(Math.random() * 2000000) + 100000,
    changePercentage: Math.floor(Math.random() * 1000) + 50,
    isExploding: Math.random() > 0.7, // 30% 概率为黑天鹅
    category: categories[index % categories.length],
    chartData: generateChartData(Math.random() > 0.5 ? 'exploding' : 'volatile'),
    peakDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    currentTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
  }));
};

// 合并原有数据和新生成的数据
export const blackSwanSuggestions: SearchSuggestion[] = blackSwanCategories.flatMap(category =>
  category.keywords.slice(0, 5).map(keyword => ({
    keyword,
    category: category.name,
    description: `${category.name}相关的黑天鹅关键词`
  }))
);

const generateChartData = (trend: 'exploding' | 'declining' | 'stable' | 'volatile'): { date: string; value: number }[] => {
  const data: { date: string; value: number }[] = [];
  const currentYear = new Date().getFullYear();
  
  for (let year = 2004; year <= currentYear; year++) {
    let value: number;
    const progress = (year - 2004) / (currentYear - 2004);
    
    switch (trend) {
      case 'exploding':
        value = progress < 0.8 ? 10 + progress * 20 : 30 + (progress - 0.8) * 350;
        break;
      case 'declining':
        value = progress < 0.3 ? progress * 200 : 60 - (progress - 0.3) * 70;
        break;
      case 'volatile':
        value = 30 + Math.sin(progress * Math.PI * 4) * 20 + Math.random() * 15;
        break;
      default:
        value = 20 + progress * 40 + Math.random() * 10;
    }
    
    data.push({
      date: `${year}-01-01`,
      value: Math.max(0, Math.round(value))
    });
  }
  
  return data;
};

// 合并传统黑天鹅数据和AI黑天鹅数据
export const mockTrendData: TrendData[] = [
  ...generateMoreTrendData(),
  ...generateAITrendData()
];