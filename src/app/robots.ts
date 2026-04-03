import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        // AI search engines and assistants - explicitly allowed for GEO
        userAgent: [
          'GPTBot',           // OpenAI GPT
          'ChatGPT-User',     // ChatGPT browsing
          'ClaudeBot',        // Anthropic Claude
          'Claude-Web',       // Claude web search
          'PerplexityBot',    // Perplexity AI
          'Applebot-Extended', // Apple Intelligence
          'cohere-ai',        // Cohere
          'Google-Extended',  // Google AI (Bard/Gemini)
          'Amazonbot',        // Amazon Alexa/AI
          'Meta-ExternalAgent', // Meta AI
          'YouBot',           // You.com
          'PhindBot',         // Phind AI
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://www.mnemox.ai/sitemap.xml',
    host: 'https://www.mnemox.ai',
  };
}
