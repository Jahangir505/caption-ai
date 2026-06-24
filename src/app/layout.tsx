import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CaptionAI — Generate Viral Captions in Seconds",
  description:
    "AI-powered social media caption generator for Instagram, Facebook, Twitter, LinkedIn, and TikTok. Free tier available. Supports English and Bengali.",
  keywords: ["caption generator", "AI captions", "social media", "instagram captions", "bengali captions"],
  authors: [{ name: "CaptionAI" }],
  openGraph: {
    title: "CaptionAI — Generate Viral Captions in Seconds",
    description: "AI-powered social media caption generator",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
