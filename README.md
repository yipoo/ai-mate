# AI Mate

<p align="center">
  <img src="public/logo.png" alt="AI Mate Logo" width="256" height="256" />
</p>

AI Mate is a powerful AI copywriting assistant that helps you create engaging content for various social media platforms. Visit our website at [ai-mate.yipoo.com](https://ai-mate.yipoo.com).

[中文文档](./docs/README-zh.md)

## Features

- **AI-Powered Copywriting**: Generate high-quality content tailored for different platforms
- **Multiple Styles**: Choose from various writing styles to match your brand voice
- **User-Friendly Interface**: Simple and intuitive design for effortless content creation
- **Content Management**: Save and organize your copywriting in folders
- **Mobile Responsive**: Create content on any device

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [OpenAI API](https://openai.com/) - AI text generation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yipoo/ai-mate.git
cd ai-mate
```

2. Install dependencies using pnpm:

```bash
pnpm install
```

3. Set up environment variables:

Copy the example env file and update it with your credentials:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your own values:

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_connection_string
```

4. Run database migrations:

```bash
pnpm prisma migrate dev
```

5. Start the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

The application is deployed to [ai-mate.yipoo.com](https://ai-mate.yipoo.com).

### Deploy on Your Own Server

1. Build the application:

```bash
pnpm build
```

2. Start the production server:

```bash
pnpm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please reach out to us at [dinglei@liansuo.com](mailto:dinglei@liansuo.com).

## GitHub Stats

[![GitHub stars](https://img.shields.io/github/stars/yipoo/ai-mate.svg?style=social&label=Star&maxAge=2592000)](https://github.com/yipoo/ai-mate)
