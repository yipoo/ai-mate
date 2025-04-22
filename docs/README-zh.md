# AI Mate

![AI Mate 标志](../public/logo.png)

AI Mate 是一款强大的 AI 文案助手，帮助您为各种社交媒体平台创建吸引人的内容。访问我们的网站：[ai-mate.yipoo.com](https://ai-mate.yipoo.com)。

[English Documentation](../README.md)

## 功能特点

- **AI 驱动的文案创作**：生成针对不同平台量身定制的高质量内容
- **多种写作风格**：选择各种写作风格来匹配您的品牌调性
- **用户友好界面**：简洁直观的设计，轻松创建内容
- **内容管理**：将您的文案保存和整理到文件夹中
- **移动设备响应式**：在任何设备上创建内容

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [PostgreSQL](https://www.postgresql.org/) - 数据库
- [Tailwind CSS](https://tailwindcss.com/) - 样式设计
- [OpenAI API](https://openai.com/) - AI 文本生成

## 开始使用

### 前置要求

- Node.js 18.x 或更高版本
- pnpm 8.x 或更高版本
- PostgreSQL 数据库

### 安装

1. 克隆仓库：

```bash
git clone https://github.com/yipoo/ai-mate.git
cd ai-mate
```

2. 使用 pnpm 安装依赖：

```bash
pnpm install
```

3. 设置环境变量：

复制示例环境文件并更新您的凭据：

```bash
cp .env.local.example .env.local
```

使用您自己的值更新 `.env.local`：

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_connection_string
```

4. 运行数据库迁移：

```bash
pnpm prisma migrate dev
```

5. 启动开发服务器：

```bash
pnpm dev
```

6. 使用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看应用程序。

## 部署

应用程序已部署至 [ai-mate.yipoo.com](https://ai-mate.yipoo.com)。

### 在您自己的服务器上部署

1. 构建应用程序：

```bash
pnpm build
```

2. 启动生产服务器：

```bash
pnpm start
```

## 许可证

该项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件。

## 联系我们

如有任何疑问，请通过 [contact@ai-mate.yipoo.com](mailto:contact@ai-mate.yipoo.com) 与我们联系。 