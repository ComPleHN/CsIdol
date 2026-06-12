import type { MapPlayerStats } from "@/app/types";
import { parseScore } from "@/lib/score";

export type { MapPlayerStats };

export const EMPTY_MAP_PLAYER_STATS: MapPlayerStats = {
  rating: 0,
  kills: 0,
  deaths: 0,
  headshots: 0,
  adr: 0,
  kastRounds: 0,
  multiKillRounds: 0,
  survivedRounds: 0,
  openingKills: 0,
  clutchWins: 0,
  impact: 0,
};

/** 直接填数值的字段 */
export const MAP_PLAYER_DIRECT_FIELDS = [
  { key: "rating" as const, label: "Rating", step: "0.01" },
  { key: "adr" as const, label: "ADR", step: "0.1" },
  { key: "impact" as const, label: "Impact", step: "0.01" },
];

/** 填个数、自动算率（÷ 总回合） */
export const MAP_PLAYER_COUNT_FIELDS = [
  { key: "openingKills" as const, label: "首杀数", rateLabel: "首杀率" },
  { key: "kastRounds" as const, label: "KAST 回合", rateLabel: "KAST" },
  { key: "survivedRounds" as const, label: "存活回合", rateLabel: "存活率" },
  { key: "multiKillRounds" as const, label: "多杀回合", rateLabel: "多杀占比" },
  { key: "clutchWins" as const, label: "残局数", rateLabel: "残局胜率" },
] as const;

function round(n: number, digits = 2): number {
  const m = 10 ** digits;
  return Math.round(n * m) / m;
}

type LegacyStats = Partial<MapPlayerStats> & {
  kd?: number;
  headshotPct?: number;
  kast?: number;
  survivalPct?: number;
  openingKillPct?: number;
  clutchWinPct?: number;
  clutchAttempts?: number;
};

export function normalizeMapPlayerStats(raw?: LegacyStats): MapPlayerStats {
  return {
    rating: raw?.rating ?? 0,
    kills: raw?.kills ?? 0,
    deaths: raw?.deaths ?? 0,
    headshots: raw?.headshots ?? 0,
    adr: raw?.adr ?? 0,
    kastRounds: raw?.kastRounds ?? 0,
    multiKillRounds: raw?.multiKillRounds ?? 0,
    survivedRounds: raw?.survivedRounds ?? 0,
    openingKills: raw?.openingKills ?? 0,
    clutchWins: raw?.clutchWins ?? 0,
    impact: raw?.impact ?? 0,
  };
}

export function getMapPlayerStats(raw?: LegacyStats): MapPlayerStats {
  return normalizeMapPlayerStats(raw);
}

export function mapRoundsFromScore(mapScore: string): number {
  const [left, right] = parseScore(mapScore);
  return Number(left) + Number(right);
}

/** 个数 / 总回合 → 百分比 */
export function countPerRoundRate(count: number, mapScore: string): number {
  const rounds = mapRoundsFromScore(mapScore);
  if (rounds <= 0 || count <= 0) return 0;
  return round((count / rounds) * 100, 1);
}

export function computeKd(stats: Pick<MapPlayerStats, "kills" | "deaths">): number {
  if (stats.deaths <= 0) return stats.kills > 0 ? stats.kills : 0;
  return round(stats.kills / stats.deaths, 2);
}

export function computeHeadshotPct(stats: Pick<MapPlayerStats, "kills" | "headshots">): number {
  if (stats.kills <= 0 || stats.headshots <= 0) return 0;
  return round((stats.headshots / stats.kills) * 100, 1);
}

export function computeKpr(kills: number, mapScore: string): number {
  const rounds = mapRoundsFromScore(mapScore);
  if (rounds <= 0 || kills <= 0) return 0;
  return round(kills / rounds, 2);
}

export interface ComputedMapRates {
  kd: number;
  headshotPct: number;
  kpr: number;
  openingKillPct: number;
  kast: number;
  survivalPct: number;
  multiKillRate: number;
  clutchWinPct: number;
}

/** 由个数 + 地图比分算出各项率 */
export function computeMapRates(stats: MapPlayerStats, mapScore: string): ComputedMapRates {
  return {
    kd: computeKd(stats),
    headshotPct: computeHeadshotPct(stats),
    kpr: computeKpr(stats.kills, mapScore),
    openingKillPct: countPerRoundRate(stats.openingKills, mapScore),
    kast: countPerRoundRate(stats.kastRounds, mapScore),
    survivalPct: countPerRoundRate(stats.survivedRounds, mapScore),
    multiKillRate: countPerRoundRate(stats.multiKillRounds, mapScore),
    clutchWinPct: countPerRoundRate(stats.clutchWins, mapScore),
  };
}

export function hasMapPlayerStats(raw?: LegacyStats): boolean {
  if (!raw) return false;
  const s = normalizeMapPlayerStats(raw);
  return (
    s.rating > 0 ||
    s.kills > 0 ||
    s.deaths > 0 ||
    s.headshots > 0 ||
    s.adr > 0 ||
    s.kastRounds > 0 ||
    s.multiKillRounds > 0 ||
    s.survivedRounds > 0 ||
    s.openingKills > 0 ||
    s.clutchWins > 0 ||
    s.impact > 0
  );
}

export function buildPlayerRadarStats(overview: {
  rating: number;
  multiKillRate: number;
  kast: number;
  adr: number;
  survivalPct: number;
  kpr: number;
}) {
  return [
    { subject: "Rating", value: Math.min(round((overview.rating / 1.3) * 100, 1), 100), fullMark: 100 },
    { subject: "多杀回合", value: Math.min(overview.multiKillRate, 100), fullMark: 100 },
    { subject: "KAST", value: Math.min(overview.kast, 100), fullMark: 100 },
    { subject: "ADR", value: Math.min(round(overview.adr, 1), 100), fullMark: 100 },
    { subject: "存活率", value: Math.min(overview.survivalPct, 100), fullMark: 100 },
    { subject: "KPR", value: Math.min(round(overview.kpr * 100, 1), 100), fullMark: 100 },
  ];
}
