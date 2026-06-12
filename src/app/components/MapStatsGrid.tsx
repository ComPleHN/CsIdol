import Image from "next/image";
import type { MapStat } from "@/app/types";
import { Card, CardContent } from "@/app/components/ui/card";
import { getMapMeta } from "@/lib/maps";
import { cn } from "@/lib/utils";

interface MapStatsGridProps {
  data: MapStat[];
  /** 有个人 Rating 数据时显示 Rating，否则显示回合指数 */
  showPlayerRating?: boolean;
}

/** 地图统计卡片网格：每张地图展示代表图 + 胜率数据 */
export default function MapStatsGrid({ data, showPlayerRating = false }: MapStatsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((map) => {
        const meta = getMapMeta(map.name);
        return (
          <Card key={map.name} className="esports-card overflow-hidden">
            <div className="relative h-24 w-full">
              {meta ? (
                <>
                  <Image
                    src={meta.image}
                    alt={map.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </>
              ) : (
                <div className="h-full bg-secondary" />
              )}
              <div className="absolute bottom-2 left-3 flex items-center gap-2">
                {meta && (
                  <span className="relative h-6 w-6 overflow-hidden rounded border border-white/20">
                    <Image src={meta.icon} alt="" fill className="object-cover" sizes="24px" />
                  </span>
                )}
                <span className="text-sm font-bold text-white drop-shadow">{map.name}</span>
              </div>
            </div>
            <CardContent className="grid grid-cols-3 gap-2 p-3 text-center text-xs">
              <div>
                <p className="text-muted-foreground">胜率</p>
                <p className="text-base font-bold text-primary">{map.winRate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">场次</p>
                <p className="text-base font-bold">{map.played}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{showPlayerRating ? "Rating" : "回合指数"}</p>
                <p className={cn("text-base font-bold", map.rating >= 1.1 ? "text-esports-green" : "")}>
                  {map.rating.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
