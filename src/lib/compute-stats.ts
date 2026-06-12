import type { MapStat, Match, PlayerStats, RadarStat, StatsOverview } from "@/app/types";
import { buildPlayerRadarStats, getMapPlayerStats, hasMapPlayerStats } from "@/lib/map-player-stats";
import { parseScore } from "@/lib/score";

function pct(wins: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((wins / total) * 1000) / 10;
}

function round(n: number, digits = 1): number {
  const m = 10 ** digits;
  return Math.round(n * m) / m;
}

function avg(values: number[], digits = 2): number {
  if (!values.length) return 0;
  return round(values.reduce((sum, v) => sum + v, 0) / values.length, digits);
}

function mapDepth(maps: MapStat[]): number {
  if (!maps.length) return 0;
  const qualified = maps.filter((m) => m.played >= 1 && m.winRate >= 50).length;
  return pct(qualified, maps.length);
}

type MapAgg = {
  played: number;
  wins: number;
  roundsWon: number;
  roundsLost: number;
  kills: number;
  deaths: number;
  headshots: number;
  ratings: number[];
  adrs: number[];
  kasts: number[];
  multiKillRounds: number[];
  survivedRounds: number[];
  openingKills: number[];
  impacts: number[];
  clutches: number[];
};

function emptyAgg(): MapAgg {
  return {
    played: 0,
    wins: 0,
    roundsWon: 0,
    roundsLost: 0,
    kills: 0,
    deaths: 0,
    headshots: 0,
    ratings: [],
    adrs: [],
    kasts: [],
    multiKillRounds: [],
    survivedRounds: [],
    openingKills: [],
    impacts: [],
    clutches: [],
  };
}

/** 根据比赛记录自动计算综合统计 */
export function computeStatsFromMatches(matches: Match[]): PlayerStats {
  let matchWins = 0;
  let mapWins = 0;
  let mapLosses = 0;
  let roundsWon = 0;
  let roundsLost = 0;
  let closeMapWins = 0;
  let closeMapTotal = 0;
  let playerMapsRecorded = 0;

  const allRatings: number[] = [];
  const allAdrs: number[] = [];
  const allImpacts: number[] = [];

  let totalKills = 0;
  let totalDeaths = 0;
  let totalHeadshots = 0;
  let totalMultiKillRounds = 0;
  let totalKastRounds = 0;
  let totalSurvivedRounds = 0;
  let totalOpeningKills = 0;
  let totalClutchWins = 0;
  let totalPlayerRounds = 0;

  const mapAgg = new Map<string, MapAgg>();

  for (const match of matches) {
    if (match.result === "win") matchWins++;

    for (const map of match.maps) {
      const [leftStr, rightStr] = parseScore(map.score);
      const left = Number(leftStr);
      const right = Number(rightStr);

      if (map.result === "win") mapWins++;
      else mapLosses++;

      roundsWon += left;
      roundsLost += right;

      const margin = Math.abs(left - right);
      if (margin <= 3) {
        closeMapTotal++;
        if (map.result === "win") closeMapWins++;
      }

      const entry = mapAgg.get(map.name) ?? emptyAgg();
      entry.played++;
      if (map.result === "win") entry.wins++;
      entry.roundsWon += left;
      entry.roundsLost += right;

      if (hasMapPlayerStats(map.playerStats)) {
        playerMapsRecorded++;
        const ps = getMapPlayerStats(map.playerStats);
        const mapRounds = left + right;

        if (mapRounds > 0) totalPlayerRounds += mapRounds;

        if (ps.rating > 0) entry.ratings.push(ps.rating);
        if (ps.kills > 0 || ps.deaths > 0) {
          entry.kills += ps.kills;
          entry.deaths += ps.deaths;
          totalKills += ps.kills;
          totalDeaths += ps.deaths;
        }
        if (ps.headshots > 0) {
          entry.headshots += ps.headshots;
          totalHeadshots += ps.headshots;
        }
        if (ps.multiKillRounds > 0) {
          entry.multiKillRounds.push(ps.multiKillRounds);
          totalMultiKillRounds += ps.multiKillRounds;
        }
        if (ps.kastRounds > 0) {
          entry.kasts.push(ps.kastRounds);
          totalKastRounds += ps.kastRounds;
        }
        if (ps.survivedRounds > 0) {
          entry.survivedRounds.push(ps.survivedRounds);
          totalSurvivedRounds += ps.survivedRounds;
        }
        if (ps.openingKills > 0) {
          entry.openingKills.push(ps.openingKills);
          totalOpeningKills += ps.openingKills;
        }
        if (ps.clutchWins > 0) {
          totalClutchWins += ps.clutchWins;
        }
        if (ps.adr > 0) entry.adrs.push(ps.adr);
        if (ps.impact > 0) entry.impacts.push(ps.impact);
      }

      mapAgg.set(map.name, entry);
    }
  }

  for (const agg of mapAgg.values()) {
    allRatings.push(...agg.ratings);
    allAdrs.push(...agg.adrs);
    allImpacts.push(...agg.impacts);
  }

  const totalMatches = matches.length;
  const totalMaps = mapWins + mapLosses;
  const totalRounds = roundsWon + roundsLost;

  const sorted = [...matches].sort((a, b) => b.date.localeCompare(a.date));
  const recent = sorted.slice(0, 5);
  const recentWins = recent.filter((m) => m.result === "win").length;

  const overview: StatsOverview = {
    matchWinRate: pct(matchWins, totalMatches),
    mapWinRate: pct(mapWins, totalMaps),
    roundWinRate: pct(roundsWon, totalRounds),
    totalMatches,
    totalMaps,
    avgRoundMargin: totalMaps ? round((roundsWon - roundsLost) / totalMaps, 1) : 0,
    closeMapWinRate: pct(closeMapWins, closeMapTotal),
    recentForm: pct(recentWins, recent.length),
    rating: avg(allRatings),
    kd: totalDeaths > 0 ? round(totalKills / totalDeaths, 2) : totalKills > 0 ? totalKills : 0,
    adr: avg(allAdrs, 1),
    headshotPct: totalKills > 0 ? round((totalHeadshots / totalKills) * 100, 1) : 0,
    kast: totalPlayerRounds > 0 ? round((totalKastRounds / totalPlayerRounds) * 100, 1) : 0,
    multiKillRate: totalPlayerRounds > 0 ? round((totalMultiKillRounds / totalPlayerRounds) * 100, 1) : 0,
    survivalPct: totalPlayerRounds > 0 ? round((totalSurvivedRounds / totalPlayerRounds) * 100, 1) : 0,
    kpr: totalPlayerRounds > 0 ? round(totalKills / totalPlayerRounds, 2) : 0,
    impact: avg(allImpacts),
    openingKillPct: totalPlayerRounds > 0 ? round((totalOpeningKills / totalPlayerRounds) * 100, 1) : 0,
    clutchWinPct: totalPlayerRounds > 0 ? round((totalClutchWins / totalPlayerRounds) * 100, 1) : 0,
    playerMapsRecorded,
  };

  const maps: MapStat[] = [...mapAgg.entries()]
    .map(([name, agg]) => {
      const roundTotal = agg.roundsWon + agg.roundsLost;
      const roundWr = roundTotal ? agg.roundsWon / roundTotal : 0;
      const fallbackRating = round(0.7 + roundWr * 0.6, 2);
      return {
        name,
        winRate: pct(agg.wins, agg.played),
        played: agg.played,
        rating: agg.ratings.length ? avg(agg.ratings) : fallbackRating,
      };
    })
    .sort((a, b) => b.played - a.played);

  const hasPlayer = playerMapsRecorded > 0;
  const radar: RadarStat[] = hasPlayer
    ? buildPlayerRadarStats(overview)
    : [
        { subject: "系列赛", value: overview.matchWinRate, fullMark: 100 },
        { subject: "地图池", value: overview.mapWinRate, fullMark: 100 },
        { subject: "回合控制", value: overview.roundWinRate, fullMark: 100 },
        { subject: "关键局", value: overview.closeMapWinRate, fullMark: 100 },
        { subject: "近期状态", value: overview.recentForm, fullMark: 100 },
        { subject: "地图深度", value: mapDepth(maps), fullMark: 100 },
      ];

  return { overview, maps, radar };
}
