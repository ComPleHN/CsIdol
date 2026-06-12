"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MapStat } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface MapWinRateChartProps {
  data: MapStat[];
}

/** 地图胜率柱状图（Recharts） */
export default function MapWinRateChart({ data }: MapWinRateChartProps) {
  return (
    <Card className="esports-card">
      <CardHeader>
        <CardTitle className="text-base">地图胜率</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252b3b" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#8b929e", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#8b929e", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                background: "#12151c",
                border: "1px solid #252b3b",
                borderRadius: "8px",
                color: "#e8eaed",
              }}
              formatter={(value) => [`${value ?? 0}%`, "胜率"]}
            />
            <Bar dataKey="winRate" fill="#f5a623" radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
