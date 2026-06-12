import playerJson from "./player.json";
import matchesJson from "./matches.json";
import type { Match, Player, PlayerStats } from "@/app/types";
import { computeStatsFromMatches } from "@/lib/compute-stats";

/** 本地静态数据入口，前端直接 import 渲染 */
export const player = playerJson as Player;
export const matches = matchesJson as Match[];
/** 由比赛记录自动汇总，无需单独维护 stats.json */
export const stats: PlayerStats = computeStatsFromMatches(matches);
