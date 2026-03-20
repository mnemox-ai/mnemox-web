import type { Metadata } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GA_ID } from "@/lib/config";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mnemox.ai"),
  title: {
    default: "Mnemox AI — AI Tools for Traders & Developers",
    template: "%s | Mnemox",
  },
  description:
    "AI-powered tools for traders and developers. TradeMemory Protocol for algorithmic trading memory, Idea Reality Check for pre-build validation.",
  openGraph: {
    title: "Mnemox AI — AI Tools for Traders & Developers",
    description:
      "TradeMemory Protocol for algorithmic trading memory. Idea Reality Check for pre-build validation.",
    url: "https://www.mnemox.ai",
    siteName: "Mnemox AI",
    images: [
      {
        url: "/assets/og-home.png",
        width: 1200,
        height: 630,
        alt: "Mnemox AI",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mnemox AI — AI Tools for Traders & Developers",
    description:
      "TradeMemory Protocol for trading memory. Idea Reality Check for pre-build validation.",
    images: ["/assets/og-home.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-display antialiased`}
      >
        <ClerkProvider
          appearance={{
            variables: { colorPrimary: '#00b4ff' },
            elements: {
              card: 'bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)]',
              headerTitle: 'text-white',
              headerSubtitle: 'text-[rgba(255,255,255,0.5)]',
              socialButtonsBlockButton: 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)] text-white',
              formFieldInput: 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)] text-white',
              footerActionLink: 'text-[#00b4ff]',
            },
          }}
        >
          <I18nProvider>
            <BackgroundEffects />
            <Nav />
            <main className="pt-[64px]">{children}</main>
            <Footer />
          </I18nProvider>
        </ClerkProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Mnemox AI',
              url: 'https://www.mnemox.ai',
              logo: 'https://www.mnemox.ai/assets/og-home.png',
              description:
                'AI-powered tools for traders and developers.',
              sameAs: ['https://github.com/mnemox-ai'],
            }),
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
