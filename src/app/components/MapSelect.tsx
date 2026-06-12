"use client";

import Image from "next/image";
import { MAP_NAME_OPTIONS, getMapMeta } from "@/lib/maps";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";

interface MapSelectProps {
  value: string;
  onChange: (name: string) => void;
  label?: string;
  /** 是否显示选中地图的预览图 */
  showPreview?: boolean;
  className?: string;
}

/** 地图下拉选择 + 代表图预览（Admin / 表单用） */
export default function MapSelect({
  value,
  onChange,
  label,
  showPreview = true,
  className,
}: MapSelectProps) {
  const meta = getMapMeta(value);
  const unknownCustom = value && !meta && !MAP_NAME_OPTIONS.includes(value);

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label className="mb-1.5 block">{label}</Label> : null}
      <select
        className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
        value={MAP_NAME_OPTIONS.includes(value) ? value : value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          选择地图
        </option>
        {MAP_NAME_OPTIONS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
        {unknownCustom ? <option value={value}>{value}</option> : null}
      </select>

      {showPreview && meta ? (
        <div className="relative h-20 overflow-hidden rounded-md border border-border">
          <Image
            src={meta.image}
            alt={meta.displayName}
            fill
            className="object-cover"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <span className="relative h-6 w-6 overflow-hidden rounded border border-white/30">
              <Image src={meta.icon} alt="" fill className="object-cover" sizes="24px" />
            </span>
            <span className="text-xs font-semibold text-white">{meta.displayName}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** 紧凑行：左侧缩略图 + 右侧下拉 */
export function MapSelectRow({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (name: string) => void;
  className?: string;
}) {
  const meta = getMapMeta(value);

  return (
    <div className={cn("flex min-w-[140px] flex-1 gap-2", className)}>
      {meta ? (
        <span className="relative h-9 w-14 shrink-0 overflow-hidden rounded border border-border">
          <Image src={meta.image} alt={value} fill className="object-cover" sizes="56px" />
        </span>
      ) : (
        <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded border border-dashed border-border text-[10px] text-muted-foreground">
          地图
        </span>
      )}
      <select
        className="h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm"
        value={MAP_NAME_OPTIONS.includes(value) ? value : value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          选择
        </option>
        {MAP_NAME_OPTIONS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
