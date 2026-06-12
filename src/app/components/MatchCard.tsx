import { Calendar, Swords } from "lucide-react";
import type { Match } from "@/app/types";
import MapThumbnail, { MapBadge } from "@/app/components/MapThumbnail";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { getMapMeta } from "@/lib/maps";
import { player } from "@/app/data";

interface MatchCardProps {
  match: Match;
}

/** 赛事卡片：展示单场比赛信息 */
export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Card className="esports-card overflow-hidden">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{match.event}</CardTitle>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {match.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{match.eventTag}</Badge>
            <Badge variant={match.result === "win" ? "win" : "loss"}>
              {match.result === "win" ? "WIN" : "LOSS"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* 对阵与总比分 */}
        <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-4 py-3">
          <span className="font-semibold text-primary">{player.team}</span>
          <span className="flex items-center gap-2 text-lg font-bold">
            <Swords className="h-4 w-4 text-muted-foreground" />
            {match.score}
          </span>
          <span className="font-semibold text-foreground">{match.opponent}</span>
        </div>

        {/* 单局地图结果 */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">地图详情</p>
          {match.maps.map((map) => {
            const meta = getMapMeta(map.name);
            return (
              <div
                key={`${match.id}-${map.name}`}
                className="relative overflow-hidden rounded-md border border-border/60"
              >
                {meta && (
                  <div className="absolute inset-0 opacity-30">
                    <MapThumbnail mapName={map.name} size="banner" className="h-full min-h-[52px] rounded-none border-0" />
                  </div>
                )}
                <div className="relative flex items-center justify-between px-3 py-2.5 text-sm backdrop-blur-[1px]">
                  <MapBadge mapName={map.name} />
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted-foreground">{map.score}</span>
                    <Badge variant={map.result === "win" ? "win" : "loss"} className="min-w-[52px] justify-center">
                      {map.result === "win" ? "胜" : "负"}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
