import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Applebot-Extended', 'cohere-ai'],
        allow: '/',
      },
    ],
    sitemap: 'https://www.mnemox.ai/sitemap.xml',
  };
}
