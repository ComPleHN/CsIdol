"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";

import { parseScore, formatScore } from "@/lib/score";

interface ScoreInputProps {
  value: string;
  onChange: (score: string) => void;
  label?: string;
  /** 紧凑模式，用于地图行 */
  compact?: boolean;
  className?: string;
}

/** 比分输入：左右两个数字，存储为 "X:Y" */
export default function ScoreInput({
  value,
  onChange,
  label,
  compact = false,
  className,
}: ScoreInputProps) {
  const [left, setLeft] = useState("0");
  const [right, setRight] = useState("0");
  const [focused, setFocused] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    if (focused) return;
    const [l, r] = parseScore(value);
    setLeft(l);
    setRight(r);
  }, [value, focused]);

  const handleChange = (side: "left" | "right", raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (side === "left") setLeft(digits);
    else setRight(digits);
  };

  const handleBlur = (side: "left" | "right", raw: string) => {
    setFocused(null);
    const l = (side === "left" ? raw : left).replace(/\D/g, "") || "0";
    const r = (side === "right" ? raw : right).replace(/\D/g, "") || "0";
    setLeft(l);
    setRight(r);
    onChange(`${l}:${r}`);
  };

  return (
    <div className={cn(compact ? undefined : "space-y-1.5", className)}>
      {label ? (
        <Label className={cn("block", compact && "mb-1 normal-case text-[10px]")}>{label}</Label>
      ) : null}
      <div className={cn("flex items-center gap-1.5", compact ? "h-8" : "h-9")}>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={cn("text-center font-mono tabular-nums", compact ? "h-8 w-14 px-1" : "h-9 w-16")}
          value={left}
          onFocus={() => setFocused("left")}
          onChange={(e) => handleChange("left", e.target.value)}
          onBlur={(e) => handleBlur("left", e.target.value)}
          aria-label="我方比分"
        />
        <span className={cn("shrink-0 font-mono text-muted-foreground", compact ? "text-sm" : "text-base")}>
          :
        </span>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={cn("text-center font-mono tabular-nums", compact ? "h-8 w-14 px-1" : "h-9 w-16")}
          value={right}
          onFocus={() => setFocused("right")}
          onChange={(e) => handleChange("right", e.target.value)}
          onBlur={(e) => handleBlur("right", e.target.value)}
          aria-label="对方比分"
        />
      </div>
    </div>
  );
}
