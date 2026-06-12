import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "CS IDOL — NiKo 职业选手展示站",
  description: "CS2 职业选手 NiKo 个人展示网站，赛事、数据、图集",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          <p>CS IDOL · Counter-Strike 2 Pro Showcase · 数据均为本地静态 JSON</p>
        </footer>
      </body>
    </html>
  );
}
