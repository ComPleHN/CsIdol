import Image from "next/image";
import { cn } from "@/lib/utils";
import { getMapMeta } from "@/lib/maps";

interface MapThumbnailProps {
  mapName: string;
  size?: "sm" | "md" | "lg" | "banner";
  showLabel?: boolean;
  className?: string;
}

const sizeClass = {
  sm: "h-8 w-12",
  md: "h-12 w-20",
  lg: "h-16 w-28",
  banner: "h-24 w-full",
};

/** CS 地图缩略图：优先展示官方风格加载屏图，无图时用主题色 fallback */
export default function MapThumbnail({
  mapName,
  size = "md",
  showLabel = false,
  className,
}: MapThumbnailProps) {
  const meta = getMapMeta(mapName);

  if (!meta) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded border border-border bg-secondary text-xs font-medium text-muted-foreground",
          sizeClass[size],
          className,
        )}
      >
        {mapName}
      </div>
    );
  }

  return (
    <div className={cn("group relative overflow-hidden rounded-md border border-border/80", sizeClass[size], className)}>
      <Image
        src={meta.image}
        alt={meta.displayName}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
        sizes={size === "banner" ? "400px" : "120px"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {showLabel && (
        <span className="absolute bottom-1 left-1.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-xs">
          {meta.displayName}
        </span>
      )}
    </div>
  );
}

/** 地图名 + 小图标行内展示 */
export function MapBadge({ mapName, className }: { mapName: string; className?: string }) {
  const meta = getMapMeta(mapName);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {meta ? (
        <span className="relative h-6 w-9 shrink-0 overflow-hidden rounded border border-border/60">
          <Image src={meta.icon} alt="" fill className="object-cover" sizes="36px" />
        </span>
      ) : null}
      <span className="font-medium">{mapName}</span>
    </span>
  );
}
