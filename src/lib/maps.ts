/**
 * CS2 竞技地图资源映射
 * 图片来源于 CS2 官方游戏资源（MurkyYT/cs2-map-icons 社区镜像），已本地化至 public/images/maps/
 */

export interface CsMapMeta {
  /** 显示名（与 JSON 数据中 name 字段对应） */
  displayName: string;
  /** 内部 slug */
  slug: string;
  /** 加载屏代表图（卡片背景） */
  image: string;
  /** 小图标 */
  icon: string;
  /** 主题色，用于无图时的 fallback */
  accent: string;
}

/** 常见地图别名 → slug */
const ALIASES: Record<string, string> = {
  mirage: "mirage",
  inferno: "inferno",
  dust2: "dust2",
  "dust ii": "dust2",
  "dust 2": "dust2",
  nuke: "nuke",
  ancient: "ancient",
  anubis: "anubis",
  train: "train",
  vertigo: "vertigo",
  overpass: "overpass",
  cache: "cache",
};

export const CS_MAPS: Record<string, CsMapMeta> = {
  mirage: {
    displayName: "Mirage",
    slug: "mirage",
    image: "/images/maps/mirage.jpg",
    icon: "/images/maps/icons/mirage.png",
    accent: "#c4a35a",
  },
  inferno: {
    displayName: "Inferno",
    slug: "inferno",
    image: "/images/maps/inferno.jpg",
    icon: "/images/maps/icons/inferno.png",
    accent: "#8b4513",
  },
  dust2: {
    displayName: "Dust2",
    slug: "dust2",
    image: "/images/maps/dust2.jpg",
    icon: "/images/maps/icons/dust2.png",
    accent: "#d4a574",
  },
  nuke: {
    displayName: "Nuke",
    slug: "nuke",
    image: "/images/maps/nuke.jpg",
    icon: "/images/maps/icons/nuke.png",
    accent: "#6b8e23",
  },
  ancient: {
    displayName: "Ancient",
    slug: "ancient",
    image: "/images/maps/ancient.jpg",
    icon: "/images/maps/icons/ancient.png",
    accent: "#2d6a4f",
  },
  anubis: {
    displayName: "Anubis",
    slug: "anubis",
    image: "/images/maps/anubis.jpg",
    icon: "/images/maps/icons/anubis.png",
    accent: "#c9a227",
  },
  train: {
    displayName: "Train",
    slug: "train",
    image: "/images/maps/train.jpg",
    icon: "/images/maps/icons/train.png",
    accent: "#708090",
  },
  vertigo: {
    displayName: "Vertigo",
    slug: "vertigo",
    image: "/images/maps/vertigo.jpg",
    icon: "/images/maps/icons/vertigo.png",
    accent: "#4682b4",
  },
  overpass: {
    displayName: "Overpass",
    slug: "overpass",
    image: "/images/maps/overpass.jpg",
    icon: "/images/maps/icons/overpass.png",
    accent: "#556b2f",
  },
};

/** 将 JSON 中的地图名解析为 slug */
export function resolveMapSlug(name: string): string | null {
  const key = name.trim().toLowerCase().replace(/\s+/g, " ");
  if (ALIASES[key]) return ALIASES[key];
  if (CS_MAPS[key]) return key;
  return null;
}

/** 获取地图元数据，未知地图返回 null */
export function getMapMeta(name: string): CsMapMeta | null {
  const slug = resolveMapSlug(name);
  return slug ? CS_MAPS[slug] : null;
}

/** 获取地图代表图路径，未知地图返回 null */
export function getMapImage(name: string): string | null {
  return getMapMeta(name)?.image ?? null;
}

/** 所有已收录地图 slug 列表（Admin 下拉用） */
export const MAP_NAME_OPTIONS = Object.values(CS_MAPS).map((m) => m.displayName);
