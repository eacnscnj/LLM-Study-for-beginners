# 大模型认知地图

中文交互学习网页，以《A Survey of Large Language Models》arXiv:2303.18223v19 为主线，补充截至 2026-11-03 检索核对的研究案例。

打开 `dist/index.html` 即可离线阅读和操作。所有示意图均为重新绘制，未转载综述图表。数学实验使用教学数据，不加载、训练或调用真实 LLM。

内容：基本概念与用途、模型结构、注意力与生成、预训练和后训练、适配与应用方案、评估、综述导读、近期研究、术语索引。

“学习导览与推荐”收录 Happy-LLM、LLMBook-zh、Hugging Face LLM Course、Maxime Labonne LLM Course、LLMs from Scratch、Stanford CS336 和《动手学深度学习》。可以按学习目标选择路线，也可以搜索与筛选资料；每项均说明定位、前置知识和推荐读法，并链接到官方页面。

布局参考 [Impeccable](https://github.com/pbakaus/impeccable) 的 Read 模式、layout、typeset 与 craft-floor 方法：以正文和实验为主，控制阅读行宽，减少重复装饰，按内容层级组织留白；宽屏提供本页目录，手机使用可就地展开的模型模块说明。其上下文程序在本次环境中下载失败，未声称通过 Impeccable 自动检测；使用浏览器交互检查和截图验收。

网页入口为 `dist/index.html`；`dist/content.js` 保存课程内容，`dist/guides.js` 保存导览推荐，`dist/app.js` 处理交互，`dist/styles.css` 定义排版。无需构建或安装依赖。

学习进度只保存在当前浏览器。网站不需要 API Key，不收集输入，不依赖外部字体或脚本。资料链接在联网时打开。
