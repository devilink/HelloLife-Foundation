import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSettings } from "@/lib/settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const revalidate = 60;

const BASE_URL = "https://www.hellolifefoundation.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Hello Life Foundation | Flood Relief & Humanitarian Support",
    template: "%s | Hello Life Foundation",
  },
  description:
    "Hello Life Foundation is a transparent humanitarian platform providing flood relief, emergency aid, and community support. Donate, volunteer, or request help today.",
  keywords: [
    "Hello Life Foundation",
    "flood relief",
    "disaster relief India",
    "humanitarian aid",
    "donate for flood victims",
    "emergency relief",
    "charity India",
    "volunteer for disaster relief",
    "transparent donation platform",
    "help flood victims",
    "NGO India",
  ],
  authors: [{ name: "Hello Life Foundation" }],
  creator: "Hello Life Foundation",
  publisher: "Hello Life Foundation",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Hello Life Foundation",
    title: "Hello Life Foundation | Flood Relief & Humanitarian Support",
    description:
      "A transparent platform for donations, relief projects, and emergency help requests. Together we can change lives.",
    images: [
      {
        url: `${BASE_URL}/herp.png`,
        width: 1200,
        height: 630,
        alt: "Hello Life Foundation - Together We Can Change Lives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hello Life Foundation | Flood Relief & Humanitarian Support",
    description:
      "Transparent humanitarian platform for flood relief. Donate, volunteer, or request emergency help.",
    images: [`${BASE_URL}/herp.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

// JSON-LD Structured Data for Google Rich Results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Hello Life Foundation",
  url: BASE_URL,
  logo: `${BASE_URL}/logoss.png`,
  description:
    "Hello Life Foundation is a transparent humanitarian platform providing flood relief, emergency aid, and community support across India.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi", "Malayalam"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsMap = await getSettings();
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased`}
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preload" href="/herp.png" as="image" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="min-h-full flex flex-col font-sans">
          <Navbar navSettings={settingsMap} />
          <main className="flex-1 pt-[72px]">
            {children}
          </main>
          <Footer />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
