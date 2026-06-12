"use client";

import { useEffect, useState } from "react";
import type { MapPlayerStats } from "@/app/types";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  MAP_PLAYER_COUNT_FIELDS,
  MAP_PLAYER_DIRECT_FIELDS,
  computeMapRates,
  countPerRoundRate,
  getMapPlayerStats,
  mapRoundsFromScore,
} from "@/lib/map-player-stats";
import { cn } from "@/lib/utils";

interface MapPlayerStatsEditorProps {
  value?: MapPlayerStats;
  mapScore: string;
  onChange: (stats: MapPlayerStats) => void;
}

/** 单张地图的个人数据录入 */
export default function MapPlayerStatsEditor({ value, mapScore, onChange }: MapPlayerStatsEditorProps) {
  const stats = getMapPlayerStats(value);
  const rates = computeMapRates(stats, mapScore);
  const totalRounds = mapRoundsFromScore(mapScore);

  const patch = (partial: Partial<MapPlayerStats>) => {
    onChange({ ...stats, ...partial });
  };

  const patchNum = (key: keyof MapPlayerStats, raw: string) => {
    patch({ [key]: raw === "" ? 0 : Number(raw) });
  };

  return (
    <div className="border-t border-border/60 bg-background/50 p-2">
      <Label className="mb-2 block normal-case text-[10px] text-muted-foreground">
        个人数据（该地图）· 总回合 {totalRounds > 0 ? totalRounds : "—"}
      </Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MAP_PLAYER_DIRECT_FIELDS.map(({ key, label, step }) => (
          <div key={key}>
            <Label className="mb-1 block normal-case text-[10px]">{label}</Label>
            <Input
              type="number"
              step={step}
              className="h-8 px-2 text-sm"
              value={stats[key] || ""}
              placeholder="—"
              onChange={(e) => patchNum(key, e.target.value)}
            />
          </div>
        ))}

        <KdInput kills={stats.kills} deaths={stats.deaths} kd={rates.kd} onChange={(kills, deaths) => patch({ kills, deaths })} />

        <CountRateInput
          label="爆头数"
          rateLabel="爆头率"
          count={stats.headshots}
          rate={rates.headshotPct}
          disabled={stats.kills <= 0}
          disabledHint="先填 K"
          onChange={(headshots) => patch({ headshots })}
        />

        {MAP_PLAYER_COUNT_FIELDS.map(({ key, label, rateLabel }) => (
          <CountRateInput
            key={key}
            label={label}
            rateLabel={rateLabel}
            count={stats[key]}
            rate={countPerRoundRate(stats[key], mapScore)}
            disabled={totalRounds <= 0}
            onChange={(count) => patch({ [key]: count })}
          />
        ))}

        <ComputedStat label="KPR" value={rates.kpr > 0 ? rates.kpr.toFixed(2) : "—"} hint="击杀 ÷ 总回合" />
      </div>
    </div>
  );
}

function CountRateInput({
  label,
  rateLabel,
  count,
  rate,
  disabled,
  disabledHint,
  onChange,
}: {
  label: string;
  rateLabel: string;
  count: number;
  rate: number;
  disabled?: boolean;
  disabledHint?: string;
  onChange: (count: number) => void;
}) {
  return (
    <div>
      <Label className="mb-1 block normal-case text-[10px]">
        {label}{" "}
        {rate > 0 ? (
          <span className="text-primary">
            → {rateLabel} {rate}%
          </span>
        ) : disabled ? (
          <span className="text-muted-foreground">{disabledHint ?? "先填比分"}</span>
        ) : null}
      </Label>
      <Input
        type="text"
        inputMode="numeric"
        className={cn("h-8 px-2 text-sm font-mono tabular-nums", disabled && "opacity-50")}
        value={count > 0 ? String(count) : ""}
        placeholder="—"
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "") || 0))}
      />
    </div>
  );
}

function ComputedStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <Label className="mb-1 block normal-case text-[10px]">{label}</Label>
      <div className="flex h-8 items-center rounded-md border border-dashed border-border/60 bg-secondary/20 px-2 font-mono text-sm text-primary">
        {value !== "—" ? value : <span className="text-xs text-muted-foreground">{hint ?? "—"}</span>}
      </div>
    </div>
  );
}

function KdInput({
  kills,
  deaths,
  kd,
  onChange,
}: {
  kills: number;
  deaths: number;
  kd: number;
  onChange: (kills: number, deaths: number) => void;
}) {
  const [k, setK] = useState(String(kills));
  const [d, setD] = useState(String(deaths));
  const [focused, setFocused] = useState<"k" | "d" | null>(null);

  useEffect(() => {
    if (focused) return;
    setK(kills > 0 ? String(kills) : "");
    setD(deaths > 0 ? String(deaths) : "");
  }, [kills, deaths, focused]);

  const handleChange = (side: "k" | "d", raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (side === "k") setK(digits);
    else setD(digits);
  };

  const commit = (side: "k" | "d", raw: string) => {
    setFocused(null);
    const nextK = Number((side === "k" ? raw : k).replace(/\D/g, "") || 0);
    const nextD = Number((side === "d" ? raw : d).replace(/\D/g, "") || 0);
    setK(nextK > 0 ? String(nextK) : "");
    setD(nextD > 0 ? String(nextD) : "");
    onChange(nextK, nextD);
  };

  return (
    <div>
      <Label className="mb-1 block normal-case text-[10px]">
        K/D {kd > 0 ? <span className="text-primary">({kd.toFixed(2)})</span> : null}
      </Label>
      <div className="flex h-8 items-center gap-1">
        <Input
          type="text"
          inputMode="numeric"
          className="h-8 w-12 px-1 text-center font-mono text-sm tabular-nums"
          value={k}
          placeholder="K"
          onFocus={() => setFocused("k")}
          onChange={(e) => handleChange("k", e.target.value)}
          onBlur={(e) => commit("k", e.target.value)}
          aria-label="击杀"
        />
        <span className="shrink-0 text-xs text-muted-foreground">/</span>
        <Input
          type="text"
          inputMode="numeric"
          className="h-8 w-12 px-1 text-center font-mono text-sm tabular-nums"
          value={d}
          placeholder="D"
          onFocus={() => setFocused("d")}
          onChange={(e) => handleChange("d", e.target.value)}
          onBlur={(e) => commit("d", e.target.value)}
          aria-label="死亡"
        />
      </div>
    </div>
  );
}
