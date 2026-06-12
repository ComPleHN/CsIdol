import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}

/** 数据统计卡片 */
export default function StatCard({ label, value, icon: Icon, hint, className }: StatCardProps) {
  return (
    <Card className={cn("esports-card", className)}>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className="rounded-md border border-border bg-secondary p-2 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </CardContent>
    </Card>
  );
}
