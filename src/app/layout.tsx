import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ThemeProvider,
  ThemeStyleProvider,
} from "@/components/layouts/theme-provider";
import { Toaster } from "ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TOMO - AI-Powered Chat Assistant | Smart Conversations",
    template: "%s | TOMO"
  },
  description:
    "TOMO is an advanced AI-powered chat assistant with intelligent tools, voice chat, image generation, and real-time search. Experience the future of AI conversations with TOMO chat.",
  keywords: [
    "TOMO",
    "TOMO chat",
    "TOMO AI",
    "AI chatbot",
    "AI assistant",
    "AI chat",
    "conversational AI",
    "smart chatbot",
    "AI tools",
    "voice assistant",
    "AI image generation",
    "intelligent assistant",
    "ChatGPT alternative",
    "AI conversation",
    "TOMO Academy"
  ],
  authors: [{ name: "TOMO Academy" }],
  creator: "TOMO Academy",
  publisher: "TOMO Academy",
  metadataBase: new URL('https://chat.tomoacademy.site'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'TOMO - AI-Powered Chat Assistant | Smart Conversations',
    description: 'Experience TOMO - an advanced AI chat assistant with intelligent tools, voice capabilities, and real-time assistance. Your smart conversation partner.',
    url: 'https://chat.tomoacademy.site',
    siteName: 'TOMO - AI Chat Assistant',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/aj-logo.jpg',
        width: 512,
        height: 512,
        alt: 'TOMO Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOMO - AI-Powered Chat Assistant',
    description: 'Experience TOMO - an advanced AI chat assistant with intelligent tools, voice capabilities, and real-time assistance.',
    images: ['/aj-logo.jpg'],
    creator: '@tomoacademy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://chat.tomoacademy.site',
  },
  category: 'technology',
  classification: 'AI Chat Assistant',
  applicationName: 'TOMO',
  referrer: 'origin-when-cross-origin',
  appleWebApp: {
    capable: true,
    title: 'TOMO',
    statusBarStyle: 'default',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#667eea" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TOMO" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TOMO",
              "applicationCategory": "BusinessApplication",
              "description": "TOMO is an advanced AI-powered chat assistant with intelligent tools, voice capabilities, and real-time search.",
              "url": "https://chat.tomoacademy.site",
              "image": "https://chat.tomoacademy.site/aj-logo.jpg",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TOMO Academy",
                "url": "https://chat.tomoacademy.site"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark"]}
          storageKey="app-theme-v2"
          disableTransitionOnChange
        >
          <ThemeStyleProvider>
            <NextIntlClientProvider>
              <div id="root">
                {children}
                <Toaster richColors />
              </div>
            </NextIntlClientProvider>
          </ThemeStyleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
