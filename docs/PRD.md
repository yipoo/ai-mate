## 项目名称（暂定）

AIMate 或 AI文案助理

---

## MVP 功能列表（1 周目标）

我们只做「最小可用版本」，帮用户**输入关键词 ➜ 自动生成文案 ➜ 复制使用**

| 功能模块        | 功能详情                                 |
| ----------- | ------------------------------------ |
| 文案生成页       | 输入产品名称 + 场景（促销/日常更新）+ 平台（抖音、小红书、微博等） |
| AI 生成文案     | 使用 OpenAI API 或本地模型生成文案（多风格）         |
| 结果展示页       | 多条文案供选择，可复制                          |
| Prompt 模板管理 | 内置 prompt 模板，不需用户自己写提示词              |
| UI 基础布局     | 页面美观简洁，适合推广（Tailwind + shadcn/ui）    |

---

## 页面结构图（MVP）

```
📄 首页（/）
  └─ 输入区域：
       - 产品名称
       - 选择平台（小红书 / 抖音 / 微博）
       - 选择文案类型（活动推广 / 日常种草 / 用户评价）
       - 可选语气风格（专业、轻松、搞笑）

  └─ 生成按钮

📄 结果页（/result）
  └─ 展示生成的文案
  └─ 每段文案下方有 “复制” 按钮
```

---

## Prompt 示例（文案生成）

```
你是一位擅长写社交平台文案的运营专家。
请根据以下要求生成5条吸引人的文案：

产品名称：{{product}}
平台：{{platform}}
类型：{{scene}}（如：促销活动 / 日常种草 / 用户评论）
风格：{{style}}

请突出用户痛点与产品卖点，加入适当 emoji，适合在{{platform}}上发布。
```

---

## 技术选型

| 模块       | 技术                         |
| -------- | -------------------------- |
| 框架       | Next.js 14 (app router)    |
| 样式       | Tailwind CSS + shadcn/ui   |
| 后端 API   | Next API Routes            |
| AI 调用    | OpenAI GPT-4 或本地 Ollama 模型 |
| 数据存储（可选） | SQLite 或无需数据库（MVP 阶段可仅存日志） |
| 部署       | Vercel                     |

---

## 开发流程建议

| 日期   | 任务                                |
| ---- | --------------------------------- |
| D1   | 创建项目骨架，搭建首页 UI 表单                 |
| D2   | 接入 OpenAI API，完成 prompt 编写 & 结果展示 |
| D3   | 调整 UI 美化，优化 Copy 功能               |
| D4   | 增加多平台风格 & Prompt 模板切换             |
| D5   | 进行基本测试，部署到 Vercel 上               |
| D6-7 | 准备推广内容（短视频 + 图文），开始预热推广           |


# 新增功能：用户登录，注册。 注册登录使用 Modal 方式快捷登录。
## 手机 + 密码 （验证码）、微信扫码登录，预留小红书、抖音、weibo 登录接口，后期完善
## 登录后，可以使用文件夹的方案进行归类。比如按照账号定位管理



