"use client";

import PageHeader from "@/components/PageHeader";

const works = [
  {
    id: "de_dust2_analysis",
    title: "Dust II 战术分析",
    category: "TACTICS",
    map: "de_dust2",
    desc: "深度解析 Dust II 默认战术、A/B 区控图与 Economy 回合策略。",
    tags: ["IGL", "Strategy", "Competitive"],
    status: "Published",
  },
  {
    id: "mirage_smokes",
    title: "Mirage 烟雾投掷指南",
    category: "UTILITY",
    map: "de_mirage",
    desc: "收录 CT/T 方关键烟雾点位，含跳投与站位说明。",
    tags: ["Smokes", "Guide", "Mirage"],
    status: "Published",
  },
  {
    id: "skin_concept_01",
    title: "AK-47 皮肤概念设计",
    category: "CREATIVE",
    map: "Workshop",
    desc: "以 CS2 武器皮肤风格为灵感，完成的 AK-47 概念 Art 作品。",
    tags: ["Art", "Skin", "Workshop"],
    status: "WIP",
  },
  {
    id: "demo_review_tool",
    title: "Demo 复盘工具",
    category: "DEV",
    map: "Web App",
    desc: "基于 Web 的对局数据可视化工具，辅助赛后复盘与团队讨论。",
    tags: ["React", "Data Viz", "Tool"],
    status: "Beta",
  },
  {
    id: "inferno_retake",
    title: "Inferno Retake 模式",
    category: "COMMUNITY",
    map: "de_inferno",
    desc: "社区 Retake 服务器配置与规则文档，优化训练体验。",
    tags: ["Server", "Community", "Inferno"],
    status: "Published",
  },
  {
    id: "cs_idol_site",
    title: "CS IDOL 个人站",
    category: "DEV",
    map: "GitHub Pages",
    desc: "本站点本身——Next.js 15 静态导出，CS2 风格 UI，部署于 GitHub Pages。",
    tags: ["Next.js", "Tailwind", "Static"],
    status: "Live",
  },
];

const statusColor = {
  Published: "border-cs-green text-cs-green",
  WIP: "border-cs-accent text-cs-accent",
  Beta: "border-cs-blue text-cs-blue",
  Live: "border-cs-green text-cs-green",
};

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        tag="Inventory"
        title="作品集"
        description="战术分析、创意设计与开发项目的集合——如同 CS2 库存中的每一件装备。"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {["ALL", "TACTICS", "UTILITY", "CREATIVE", "DEV", "COMMUNITY"].map((cat) => (
          <span
            key={cat}
            className={`cs-badge ${cat === "ALL" ? "bg-cs-accent/20" : "opacity-60"}`}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <article key={work.id} className="cs-card flex flex-col p-5 sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="cs-badge">{work.category}</span>
              <span className={`cs-badge ${statusColor[work.status] || ""}`}>
                {work.status}
              </span>
            </div>

            <h3 className="text-base font-semibold uppercase leading-snug text-cs-text sm:text-lg">
              {work.title}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wider text-cs-accent/80">
              {work.map}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-cs-muted">{work.desc}</p>

            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-cs-border pt-4">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-cs-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
