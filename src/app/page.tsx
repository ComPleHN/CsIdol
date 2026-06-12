import Image from "next/image";
import { Award, Flag, Shield, Target, Trophy, Users } from "lucide-react";
import { player } from "@/app/data";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";

/** 首页：选手总览 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero 区域 */}
      <section className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border-2 border-primary/30 shadow-[0_0_40px_rgba(245,166,35,0.12)]">
          <Image
            src={player.avatar}
            alt={player.nickname}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <p className="text-xs uppercase tracking-widest text-primary">Player ID</p>
            <p className="text-lg font-bold">{player.id.toUpperCase()}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Counter-Strike 2</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{player.nickname}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{player.realName}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Flag className="h-3 w-3" /> {player.nationality}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" /> {player.team}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" /> {player.role}
            </Badge>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{player.bio}</p>
        </div>
      </section>

      {/* 生涯荣誉墙 */}
      <section className="mt-14">
        <div className="mb-6 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold uppercase tracking-wider">生涯荣誉墙</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {player.honors.map((honor) => (
            <Card key={`${honor.year}-${honor.title}`} className="esports-card">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                    {honor.year}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold">
                      <Award className="h-4 w-4 text-primary" />
                      {honor.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{honor.event}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 快速入口 */}
      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/competitions/", label: "赛事记录", icon: Users, desc: "历史对阵与地图详情" },
          { href: "/stats/", label: "数据统计", icon: Target, desc: "胜率、图表与地图数据" },
          { href: "/gallery/", label: "选手图集", icon: Trophy, desc: "比赛与官方精彩瞬间" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="esports-card rounded-lg p-5 transition hover:border-primary/50"
          >
            <item.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-semibold">{item.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </a>
        ))}
      </section>
    </div>
  );
}
