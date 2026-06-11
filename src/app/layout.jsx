"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <title>CS IDOL — Counter-Strike 风格个人站</title>
        <meta name="description" content="CS2 风格个人作品集网站" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="relative flex min-h-screen flex-col antialiased">
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
