import type { Metadata } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
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
  title: "Mnemox AI",
  description: "AI-powered tools for traders and developers",
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
