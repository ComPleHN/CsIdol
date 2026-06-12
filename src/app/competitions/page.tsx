"use client";

import { useMemo, useState } from "react";
import { matches } from "@/app/data";
import MatchCard from "@/app/components/MatchCard";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

/** 赛事页：全部比赛列表，支持标签筛选 */
export default function CompetitionsPage() {
  const tags = useMemo(
    () => ["全部", ...Array.from(new Set(matches.map((m) => m.eventTag)))],
    [],
  );
  const [activeTag, setActiveTag] = useState("全部");

  const filtered = useMemo(
    () => (activeTag === "全部" ? matches : matches.filter((m) => m.eventTag === activeTag)),
    [activeTag],
  );

  const winCount = filtered.filter((m) => m.result === "win").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 border-l-4 border-primary pl-4">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Competitions</p>
        <h1 className="mt-1 text-3xl font-bold">赛事记录</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          共 {filtered.length} 场 · 胜 {winCount} 场
        </p>
      </div>

      {/* 赛事类型筛选 */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={activeTag === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTag(tag)}
          >
            {tag}
            {tag !== "全部" && (
              <Badge variant="secondary" className="ml-1.5 bg-background/20 text-inherit">
                {matches.filter((m) => m.eventTag === tag).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
