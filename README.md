# AI Prompt Generator

A professional AI-powered prompt generator built with Next.js, Cloudflare AI, and shadcn/ui. Generate high-quality prompts for text, images, video, and code.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaikothasan%2Fai-prompt)
[![TypeScript](https://img.shields.io/badge/TypeScript-98.9%25-blue)](https://github.com/saikothasan/ai-prompt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 Professional prompt generation for multiple categories
- 🔄 Real-time streaming responses
- 🎨 Clean, modern UI with shadcn/ui components
- 📱 Fully responsive design
- ⚡ Edge Runtime for optimal performance
- 🔒 Input validation and error handling
- 🌐 Easy deployment to Vercel

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Cloudflare AI](https://developers.cloudflare.com/ai/) - AI model provider
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zod](https://zod.dev/) - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- Cloudflare account with AI access
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saikothasan/ai-prompt.git
cd ai-prompt
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
ai-prompt/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts    # AI generation endpoint
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── prompt-generator.tsx
├── lib/
│   ├── utils.ts
│   └── validations.ts
└── styles/
    └── globals.css
```

## API Reference

### POST /api/generate

Generate an AI prompt based on user input.

Request body:
```typescript
{
  category: "all" | "text" | "image" | "video" | "code";
  description: string;
  details?: string;
  length: "short" | "medium" | "long";
}
```

Response:
```typescript
{
  generatedPrompt: string;
}
```

## Deployment

The easiest way to deploy your application is with [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vercel](https://vercel.com) for the amazing platform
- [Cloudflare](https://cloudflare.com) for the AI capabilities
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components

## Author

- [@saikothasan](https://github.com/saikothasan)
