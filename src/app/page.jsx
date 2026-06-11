"use client";

import Link from "next/link";

const stats = [
  { label: "K/D", value: "1.42", pct: 71 },
  { label: "HS%", value: "48%", pct: 48 },
  { label: "Win Rate", value: "62%", pct: 62 },
  { label: "Rating", value: "1.18", pct: 79 },
];

const highlights = [
  {
    title: "竞技模式",
    desc: "专注于 CS2 竞技体验与战术分析，追求每一回合的最优决策。",
    tag: "COMPETITIVE",
  },
  {
    title: "创意工坊",
    desc: "探索地图设计、皮肤概念与社区内容创作。",
    tag: "WORKSHOP",
  },
  {
    title: "团队协作",
    desc: "与队友沟通、制定战术、复盘对局，提升整体水平。",
    tag: "TEAM PLAY",
  },
];

export default function HomePage() {
  return (
    <div className="cs-grid-bg">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-cs-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cs-accent/5 via-transparent to-cs-blue/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-cs-accent">
                Counter-Strike 2
              </p>
              <h1 className="text-4xl font-bold uppercase leading-tight tracking-wide text-cs-text sm:text-5xl lg:text-6xl">
                CS
                <span className="text-cs-accent"> IDOL</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-cs-muted sm:text-lg">
                一个以 CS2 视觉语言打造的个人站点。战术、创意、竞技——在这里展示我的 CS 世界。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/works/"
                  className="inline-flex items-center gap-2 bg-cs-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-cs-dark transition hover:bg-cs-accent-dim"
                >
                  查看作品 →
                </Link>
                <Link
                  href="/about/"
                  className="inline-flex items-center gap-2 border border-cs-border px-6 py-3 text-sm font-semibold uppercase tracking-wider text-cs-text transition hover:border-cs-accent hover:text-cs-accent"
                >
                  关于我
                </Link>
              </div>
            </div>

            {/* Stats panel */}
            <div className="w-full max-w-sm border border-cs-border bg-cs-panel p-5 sm:p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-cs-muted">
                Player Stats
              </p>
              <div className="space-y-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-cs-muted">{s.label}</span>
                      <span className="font-semibold text-cs-accent">{s.value}</span>
                    </div>
                    <div className="cs-stat-bar">
                      <div className="cs-stat-bar-fill" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-cs-muted">
          // Featured Modules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="cs-card p-5 sm:p-6">
              <span className="cs-badge">{item.tag}</span>
              <h3 className="mt-3 text-lg font-semibold uppercase text-cs-text">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cs-muted">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-cs-border bg-cs-panel">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <p className="text-sm text-cs-muted">
            Ready to connect? 浏览我的简介与作品集。
          </p>
          <div className="flex gap-2">
            <span className="cs-badge">ONLINE</span>
            <span className="cs-badge border-cs-green text-cs-green">ACCEPTING MATCHES</span>
          </div>
        </div>
      </section>
    </div>
  );
}
