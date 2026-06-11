"use client";

import PageHeader from "@/components/PageHeader";

const profile = {
  nickname: "CS IDOL",
  rank: "Global Elite",
  role: "IGL / Rifler",
  region: "Asia",
  hours: "3,200+",
};

const skills = [
  { name: "Aim", level: 85 },
  { name: "Game Sense", level: 90 },
  { name: "Communication", level: 88 },
  { name: "Utility Usage", level: 82 },
  { name: "Clutch", level: 75 },
];

const timeline = [
  { year: "2023", event: "开始 CS2 竞技之旅，冲击 Global Elite" },
  { year: "2024", event: "参与社区赛事，担任 IGL 角色" },
  { year: "2025", event: "创作 CS 相关内容，搭建个人作品集" },
  { year: "2026", event: "持续精进，探索 Web 与 CS 文化结合" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        tag="Player Profile"
        title="个人简介"
        description="热爱 Counter-Strike，享受战术博弈与团队配合。这里记录我的 CS 历程与技能图谱。"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="cs-card p-6 lg:col-span-1">
          <div className="mb-4 flex h-24 w-24 items-center justify-center border-2 border-cs-accent bg-cs-dark text-3xl font-bold text-cs-accent">
            CS
          </div>
          <h2 className="text-xl font-bold uppercase text-cs-text">{profile.nickname}</h2>
          <p className="mt-1 text-sm text-cs-accent">{profile.rank}</p>
          <dl className="mt-6 space-y-3 text-sm">
            {[
              ["角色", profile.role],
              ["地区", profile.region],
              ["游戏时长", profile.hours],
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-cs-border pb-2">
                <dt className="text-cs-muted">{key}</dt>
                <dd className="font-medium text-cs-text">{val}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Skills + Bio */}
        <div className="space-y-6 lg:col-span-2">
          <div className="cs-card p-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-cs-muted">
              Skill Matrix
            </h3>
            <div className="space-y-4">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-cs-text">{s.name}</span>
                    <span className="text-cs-accent">{s.level}%</span>
                  </div>
                  <div className="cs-stat-bar">
                    <div className="cs-stat-bar-fill" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cs-card p-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-cs-muted">
              Bio
            </h3>
            <p className="text-sm leading-relaxed text-cs-muted">
              从 CS:GO 到 CS2，Counter-Strike 一直是我生活中重要的一部分。我喜欢研究地图控图、
              道具投掷与 Economy 管理，也享受在关键回合完成 Clutch 的成就感。除了游戏本身，
              我也对 CS 社区文化、视觉设计与 Web 开发有浓厚兴趣——这个站点正是两者的结合。
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="mt-10">
        <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-cs-muted">
          // Career Timeline
        </h3>
        <div className="space-y-0 border-l-2 border-cs-border pl-6">
          {timeline.map((item, i) => (
            <div key={item.year} className={`relative pb-8 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
              <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center border-2 border-cs-accent bg-cs-dark">
                <span className="h-1.5 w-1.5 bg-cs-accent" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-cs-accent">{item.year}</p>
              <p className="mt-1 text-sm text-cs-muted">{item.event}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
