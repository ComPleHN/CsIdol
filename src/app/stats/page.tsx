import { Calendar, Crosshair, Flame, Percent, Swords, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { matches, stats } from "@/app/data";
import MapStatsGrid from "@/app/components/MapStatsGrid";
import MapWinRateChart from "@/app/components/MapWinRateChart";
import PlayerRadarChart from "@/app/components/PlayerRadarChart";
import StatCard from "@/app/components/StatCard";
import { MapBadge } from "@/app/components/MapThumbnail";

/** 数据统计页：战绩 + 个人数据均由比赛记录汇总 */
export default function StatsPage() {
  const { overview } = stats;
  const hasData = matches.length > 0;
  const hasPlayerStats = overview.playerMapsRecorded > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 border-l-4 border-primary pl-4">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Statistics</p>
        <h1 className="mt-1 text-3xl font-bold">数据统计</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          根据 {overview.totalMatches} 场系列赛 · {overview.totalMaps} 张地图自动计算
          {hasPlayerStats ? ` · 已录入 ${overview.playerMapsRecorded} 张地图个人数据` : ""}
        </p>
      </div>

      {!hasData ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          <p>暂无比赛记录，请先在 Admin 中添加比赛数据。</p>
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              // Personal Performance
            </h2>
            {hasPlayerStats ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Rating" value={overview.rating.toFixed(2)} icon={TrendingUp} hint="综合评分均值" />
                <StatCard label="K/D" value={overview.kd.toFixed(2)} icon={Crosshair} hint="击杀死亡比均值" />
                <StatCard label="ADR" value={overview.adr.toFixed(1)} icon={Flame} hint="平均每回合伤害" />
                <StatCard label="爆头率" value={`${overview.headshotPct}%`} icon={Zap} hint="Headshot %" />
                <StatCard label="KAST" value={`${overview.kast}%`} icon={Percent} hint="贡献回合占比" />
                <StatCard label="Impact" value={overview.impact.toFixed(2)} icon={TrendingUp} hint="影响力" />
                <StatCard label="首杀率" value={`${overview.openingKillPct}%`} icon={Crosshair} hint="Opening Kill" />
                <StatCard label="残局胜率" value={`${overview.clutchWinPct}%`} icon={Flame} hint="Clutch Win" />
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
                请在 Admin 比赛编辑中，为每张地图填写个人数据（Rating、K/D 等），保存后将自动汇总到此。
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              // Match Record
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="系列赛胜率" value={`${overview.matchWinRate}%`} icon={Trophy} hint="BO 系列胜负" />
              <StatCard label="地图胜率" value={`${overview.mapWinRate}%`} icon={Target} hint="单张地图胜负" />
              <StatCard label="回合胜率" value={`${overview.roundWinRate}%`} icon={Crosshair} hint="按地图比分汇总" />
              <StatCard label="记录场次" value={String(overview.totalMatches)} icon={Calendar} hint="系列赛总数" />
              <StatCard label="地图局数" value={String(overview.totalMaps)} icon={Swords} hint="打过的地图总数" />
              <StatCard
                label="平均净胜回合"
                value={overview.avgRoundMargin > 0 ? `+${overview.avgRoundMargin}` : String(overview.avgRoundMargin)}
                icon={TrendingUp}
                hint="每张地图平均回合差"
              />
              <StatCard label="关键局胜率" value={`${overview.closeMapWinRate}%`} icon={Flame} hint="分差 ≤3 回合的地图" />
              <StatCard label="近期状态" value={`${overview.recentForm}%`} icon={Percent} hint="最近 5 场系列赛" />
            </div>
          </section>

          {stats.maps.length > 0 && (
            <>
              <section className="mt-10">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  // Map Pool
                </h2>
                <MapStatsGrid data={stats.maps} showPlayerRating={hasPlayerStats} />
              </section>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <MapWinRateChart data={stats.maps} />
                <PlayerRadarChart data={stats.radar} />
              </div>

              <div className="mt-8 overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">地图</th>
                      <th className="px-4 py-3">胜率</th>
                      <th className="px-4 py-3">场次</th>
                      <th className="px-4 py-3">{hasPlayerStats ? "Rating" : "回合指数"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.maps.map((map) => (
                      <tr key={map.name} className="border-b border-border/60 hover:bg-accent/30">
                        <td className="px-4 py-3">
                          <MapBadge mapName={map.name} />
                        </td>
                        <td className="px-4 py-3 text-primary">{map.winRate}%</td>
                        <td className="px-4 py-3 text-muted-foreground">{map.played}</td>
                        <td className="px-4 py-3">{map.rating.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
