"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarStat } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface PlayerRadarChartProps {
  data: RadarStat[];
}

/** 综合数据雷达图（Recharts） */
export default function PlayerRadarChart({ data }: PlayerRadarChartProps) {
  return (
    <Card className="esports-card">
      <CardHeader>
        <CardTitle className="text-base">综合能力雷达</CardTitle>
        <p className="text-xs text-muted-foreground">Rating · 多杀回合 · KAST · ADR · 存活率 · KPR</p>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
            <PolarGrid stroke="#252b3b" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#8b929e", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#8b929e", fontSize: 10 }} />
            <Radar
              name="NiKo"
              dataKey="value"
              stroke="#f5a623"
              fill="#f5a623"
              fillOpacity={0.35}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: "#12151c",
                border: "1px solid #252b3b",
                borderRadius: "8px",
                color: "#e8eaed",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
