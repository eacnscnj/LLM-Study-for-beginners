'use strict';
window.STUDY_GUIDES = {
  resources: [
    {
      id: 'happy-llm', name: 'Happy-LLM', language: '中文', category: 'beginner', categoryName: '概念入门',
      url: 'https://datawhalechina.github.io/happy-llm/', repository: 'https://github.com/datawhalechina/happy-llm',
      reason: '从 NLP 基础、Transformer 到训练和应用，中文叙述适合先建立完整框架。',
      prerequisites: '作者建议具备一定 Python 编程经验，了解深度学习与 NLP 会更容易阅读。',
      reading: '先读第 1–4 章，联系本网站的结构图和训练实验；再按兴趣进入实践章节。',
      fit: '第一次系统学习 LLM，或希望先把术语连起来的读者。'
    },
    {
      id: 'llmbook', name: '《大语言模型》', language: '中文', category: 'reference', categoryName: '综述配套',
      url: 'https://llmbook-zh.github.io/', repository: '',
      reason: '由所读英文综述的作者团队编写，为初学者重新组织概念、算法和技术框架。',
      prerequisites: '官网说明适合具有深度学习基础的读者。',
      reading: '跟随综述的预训练、后训练、使用和评估主线，查找对应中文讲解。它并非综述的逐段翻译。',
      fit: '正在阅读 A Survey of Large Language Models，希望获得系统中文参考的读者。'
    },
    {
      id: 'huggingface', name: 'Hugging Face LLM Course', language: '英文', category: 'practice', categoryName: '概念与实践',
      url: 'https://huggingface.co/learn/llm-course/chapter1/1', repository: '',
      reason: '把模型原理、分词、数据处理和微调接到实际工具上，并配有练习。',
      prerequisites: '课程要求较好的 Python 基础，建议先学习深度学习入门；不要求事先掌握 PyTorch 或 TensorFlow。',
      reading: '先看第 1 章的模型结构与局限，再按需要读分词、数据与微调内容。',
      fit: '已经有概念框架，希望理解代码和模型实际行为的读者。'
    },
    {
      id: 'mlabonne', name: 'Maxime Labonne LLM Course', language: '英文', category: 'reference', categoryName: '学习路线',
      url: 'https://github.com/mlabonne/llm-course', repository: 'https://github.com/mlabonne/llm-course',
      reason: '将资源分为基础知识、LLM Scientist 与 LLM Engineer，方便判断不同方向该学什么。',
      prerequisites: '项目提供数学、Python、神经网络等基础入口，后续路线各有不同要求。',
      reading: '先用路线图定位知识缺口，然后只选择当前目标所需的参考；避免同时跟进所有链接。',
      fit: '想建立长期学习地图，或区分模型研究与应用工程方向的读者。'
    },
    {
      id: 'raschka', name: 'LLMs from Scratch', language: '英文', category: 'practice', categoryName: '机制与代码',
      url: 'https://github.com/rasbt/LLMs-from-scratch', repository: 'https://github.com/rasbt/LLMs-from-scratch',
      reason: 'Sebastian Raschka 的配套代码读物，逐步解释 GPT 类模型的内部计算。',
      prerequisites: '作者强调扎实的 Python 基础；PyTorch 经验有帮助，附录提供入门。',
      reading: '优先选读文本分词和注意力章节，跟踪张量形状与数值变化。是否执行完整训练可按自己的目标决定。',
      fit: '希望用短小代码核对机制、理解公式中每一步在算什么的读者。'
    },
    {
      id: 'cs336', name: 'Stanford CS336', language: '英文', category: 'advanced', categoryName: '研究与系统进阶',
      url: 'https://cs336.stanford.edu/', repository: '',
      reason: '从分词、架构与数据，一直讲到训练、规模、系统优化、对齐和评估。',
      prerequisites: '课程要求熟练 Python、深度学习与 PyTorch 经验，以及线性代数、微积分、概率和基本系统知识。',
      reading: '先按主题查讲义，理解内容之间的关系；系统与训练作业具有较高实现要求，可放到进阶阶段。',
      fit: '已有基础，准备深入模型研究、训练系统或 AI Infra 的读者。'
    },
    {
      id: 'd2l', name: '《动手学深度学习》', language: '中文 / 英文', category: 'beginner', categoryName: '前置知识',
      url: 'https://zh.d2l.ai/', repository: 'https://github.com/d2l-ai/d2l-zh',
      reason: '提供从数学预备知识、神经网络到注意力与 Transformer 的连续讲解。',
      prerequisites: '本页将它作为按需补基础的入口；代码实践还需要相应的 Python 和框架基础。',
      reading: '遇到向量、链式法则、自动求导或 MLP 不清楚时，先查对应章节，再回到当前概念。',
      fit: '希望补齐关键基础，而不是从术语表反复猜测含义的读者。'
    }
  ],
  paths: [
    {id:'concepts', name:'先建立直觉', title:'先形成完整框架，再逐个打开概念', description:'从中文讲解开始，按需补数学和神经网络基础。阅读时先能说清输入、输出和每一步的作用。', sequence:['happy-llm','d2l','huggingface']},
    {id:'survey', name:'配合综述阅读', title:'把综述中的术语放回技术主线', description:'以中文教材和综述章节为参照，用路线图定位知识缺口，再回到模型结构、训练与评估的原始资料。', sequence:['llmbook','mlabonne','cs336']},
    {id:'practice', name:'连接到代码', title:'用可观察的计算核对自己的理解', description:'先看模型与分词的实际接口，再读注意力和训练的短代码；对系统与性能感兴趣时继续进入 CS336。', sequence:['huggingface','raschka','cs336']}
  ],
  html: () => `
    <h1>从哪里继续学？</h1>
    <p class="lead">几份值得放在手边的 LLM 学习指南。先按你的问题选一条路线，再比较每份资料的定位、前置知识和推荐读法。</p>
    <section class="guide-intro"><h2>按学习目标选一条路</h2><div class="guide-paths" id="guide-paths" aria-label="学习目标"></div><div id="guide-route" class="guide-route" aria-live="polite"></div></section>
    <section><h2>课程与教材</h2><div class="guide-controls"><input id="guide-search" class="search" type="search" placeholder="搜索项目、语言或概念，例如：中文、Attention、PyTorch" aria-label="搜索学习指南"><label for="guide-category">筛选 <select id="guide-category"><option value="all">全部资源</option><option value="beginner">入门与基础</option><option value="reference">框架与参考</option><option value="practice">连接实践</option><option value="advanced">研究进阶</option></select></label></div><p id="guide-count" class="guide-note" aria-live="polite"></p><div id="guide-list"></div><p class="guide-note">项目定位与作者前置要求依据官方页面和仓库说明整理，核对日期：2026-11-03。“推荐读法”是为本站读者作出的学习建议；不代表需要完成所有课程。</p></section>
    <section class="section"><h2>哪些前置知识值得按需补齐？</h2><dl class="guide-prerequisites"><div><dt>向量与矩阵</dt><dd>能看懂点积、矩阵乘法与形状变化，用来理解 Embedding 和 Q/K/V。</dd></div><div><dt>条件概率与损失</dt><dd>理解下一个 token 的概率、Softmax、似然与交叉熵；区分生成概率和事实正确性。</dd></div><div><dt>神经网络与梯度</dt><dd>区分参数和激活，认识线性层、非线性、前向传播，以及梯度如何用于参数更新。</dd></div><div><dt>训练与评估</dt><dd>知道训练集、验证集、测试集与泛化的区别，能解释为什么训练损失下降不代表真实任务一定更可靠。</dd></div></dl><p class="guide-note">概念阅读可直接开始；需要补基础时可查 <a href="https://zh.d2l.ai/" target="_blank" rel="noopener noreferrer">《动手学深度学习》</a>，再回到本网站的 <a href="#anatomy">模型结构</a>、<a href="#training">训练实验</a>与<a href="#evaluation">评估</a>。</p></section>
    <section class="section"><h2>把资料放回自己的阅读过程</h2><div class="learning-index"><a href="#start"><strong>还没有完整的直觉</strong><span>回到一次 token 生成，从输入与概率开始。</span></a><a href="#survey"><strong>综述中的概念太密集</strong><span>按原文章节导航，查找它属于哪个技术环节。</span></a><a href="#glossary"><strong>只卡在某个术语上</strong><span>先查定义与相关概念，再回到正文。</span></a></div></section>`
};
