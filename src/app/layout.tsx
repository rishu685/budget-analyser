import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PWAInstaller } from "@/components/PWAInstaller";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BudgetBox - Local-First Personal Budgeting",
  description: "A local-first personal budgeting app that works offline, auto-saves every keystroke, and syncs when you're back online.",
  keywords: ["budgeting", "finance", "local-first", "offline-first", "personal finance"],
  authors: [{ name: "BudgetBox Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAInstaller />
        {children}
      </body>
    </html>
  );
}
