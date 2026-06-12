/** 选手基础信息 */
export interface Honor {
  year: number;
  title: string;
  event: string;
}

export interface Player {
  id: string;
  nickname: string;
  realName: string;
  nationality: string;
  nationalityCode: string;
  team: string;
  role: string;
  avatar: string;
  bio: string;
  honors: Honor[];
  gallery: GalleryItem[];
}

/** 单局个人表现 */
export interface MapPlayerStats {
  rating: number;
  kills: number;
  deaths: number;
  headshots: number;
  adr: number;
  /** KAST 贡献回合数 */
  kastRounds: number;
  /** 多杀回合数（2K+） */
  multiKillRounds: number;
  /** 存活回合数 */
  survivedRounds: number;
  /** 首杀数 */
  openingKills: number;
  /** 残局赢局数 */
  clutchWins: number;
  impact: number;
}

/** 单局地图结果 */
export interface MapResult {
  name: string;
  score: string;
  result: "win" | "loss";
  /** 该地图上的个人表现，录入后参与综合统计 */
  playerStats?: MapPlayerStats;
}

/** 比赛记录 */
export interface Match {
  id: string;
  date: string;
  event: string;
  eventTag: string;
  opponent: string;
  score: string;
  result: "win" | "loss";
  maps: MapResult[];
}

/** 综合统计数据（由比赛记录自动计算） */
export interface StatsOverview {
  matchWinRate: number;
  mapWinRate: number;
  roundWinRate: number;
  totalMatches: number;
  totalMaps: number;
  avgRoundMargin: number;
  closeMapWinRate: number;
  recentForm: number;
  /** 个人数据（各地图个数汇总后计算） */
  rating: number;
  kd: number;
  adr: number;
  headshotPct: number;
  kast: number;
  multiKillRate: number;
  survivalPct: number;
  kpr: number;
  impact: number;
  openingKillPct: number;
  clutchWinPct: number;
  playerMapsRecorded: number;
}

export interface MapStat {
  name: string;
  winRate: number;
  played: number;
  rating: number;
}

export interface RadarStat {
  subject: string;
  value: number;
  fullMark: number;
}

export interface PlayerStats {
  overview: StatsOverview;
  maps: MapStat[];
  radar: RadarStat[];
}

/** 图集条目 */
export interface GalleryItem {
  id: string;
  title: string;
  src: string;
  category: string;
}
