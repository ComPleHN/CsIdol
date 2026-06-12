"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type { GalleryItem, Honor, MapResult, Match, Player } from "@/app/types";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";
import {
  checkDataApi,
  fetchMatches,
  fetchPlayer,
  saveMatches,
  savePlayer,
} from "@/lib/admin-api";
import { player as defaultPlayer, matches as defaultMatches } from "@/app/data";
import { computeStatsFromMatches } from "@/lib/compute-stats";
import MapSelect from "@/app/components/MapSelect";
import MapPlayerStatsEditor from "@/app/components/MapPlayerStatsEditor";
import ScoreInput from "@/app/components/ScoreInput";
import { EMPTY_MAP_PLAYER_STATS } from "@/lib/map-player-stats";

type Toast = { type: "ok" | "err"; text: string } | null;

/** Admin 后台：本地开发时通过 data-api 直接读写 JSON 文件 */
export default function AdminPage() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const [player, setPlayer] = useState<Player>(defaultPlayer);
  const [matches, setMatches] = useState<Match[]>(defaultMatches);
  const stats = useMemo(() => computeStatsFromMatches(matches), [matches]);

  const [rawKey, setRawKey] = useState<"player" | "matches">("player");
  const [rawText, setRawText] = useState("");

  useEffect(() => {
    checkDataApi().then(async (ok) => {
      setApiOnline(ok);
      if (!ok) return;
      try {
        const [p, m] = await Promise.all([fetchPlayer(), fetchMatches()]);
        setPlayer(p);
        setMatches(m);
      } catch {
        setToast({ type: "err", text: "加载数据失败" });
      }
    });
  }, []);

  useEffect(() => {
    const data = rawKey === "player" ? player : matches;
    setRawText(JSON.stringify(data, null, 2));
  }, [rawKey, player, matches]);

  const showToast = (t: Toast) => {
    setToast(t);
    if (t) setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (fn: () => Promise<{ message: string }>, reload?: () => void) => {
    if (!apiOnline) {
      showToast({ type: "err", text: "请先运行 npm run dev 启动本地 data-api" });
      return;
    }
    setSaving(true);
    try {
      const res = await fn();
      showToast({ type: "ok", text: res.message });
      reload?.();
    } catch (e) {
      showToast({ type: "err", text: e instanceof Error ? e.message : "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  const saveRaw = () => {
    try {
      const parsed = JSON.parse(rawText);
      if (rawKey === "player") {
        setPlayer(parsed);
        handleSave(() => savePlayer(parsed));
      } else {
        setMatches(parsed);
        handleSave(() => saveMatches(parsed));
      }
    } catch {
      showToast({ type: "err", text: "JSON 格式错误" });
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Admin</p>
          <h1 className="mt-1 text-2xl font-bold">数据管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            编辑并保存到 <code className="text-primary">src/app/data/*.json</code>
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            返回站点
          </Button>
        </Link>
      </div>

      {/* API 状态 */}
      <Card className="mb-6 border-border">
        <CardContent className="flex items-center gap-3 p-4 text-sm">
          <Database className="h-4 w-4 text-primary" />
          {apiOnline === null && <span className="text-muted-foreground">检测本地 API...</span>}
          {apiOnline === true && (
            <span className="flex items-center gap-1.5 text-esports-green">
              <CheckCircle2 className="h-4 w-4" /> 本地 data-api 已连接，保存将直接写入文件
            </span>
          )}
          {apiOnline === false && (
            <span className="flex items-center gap-1.5 text-esports-red">
              <AlertCircle className="h-4 w-4" />
              未连接 — 请使用 <code className="mx-1">npm run dev</code> 启动（含 data-api :3456）
            </span>
          )}
        </CardContent>
      </Card>

      {toast && (
        <div
          className={`mb-4 rounded-md border px-4 py-3 text-sm ${
            toast.type === "ok"
              ? "border-esports-green/40 bg-esports-green/10 text-esports-green"
              : "border-esports-red/40 bg-esports-red/10 text-esports-red"
          }`}
        >
          {toast.text}
        </div>
      )}

      <Tabs defaultValue="player">
        <TabsList className="mb-4">
          <TabsTrigger value="player">选手</TabsTrigger>
          <TabsTrigger value="matches">比赛</TabsTrigger>
          <TabsTrigger value="stats">统计</TabsTrigger>
          <TabsTrigger value="raw">JSON</TabsTrigger>
        </TabsList>

        {/* 选手信息 */}
        <TabsContent value="player">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">player.json</CardTitle>
              <Button
                size="sm"
                disabled={saving}
                onClick={() => handleSave(() => savePlayer(player))}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                保存
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="ID" value={player.id} onChange={(v) => setPlayer({ ...player, id: v })} />
                <Field label="昵称" value={player.nickname} onChange={(v) => setPlayer({ ...player, nickname: v })} />
                <Field label="真名" value={player.realName} onChange={(v) => setPlayer({ ...player, realName: v })} />
                <Field label="国籍" value={player.nationality} onChange={(v) => setPlayer({ ...player, nationality: v })} />
                <Field label="国籍代码" value={player.nationalityCode} onChange={(v) => setPlayer({ ...player, nationalityCode: v })} />
                <Field label="战队" value={player.team} onChange={(v) => setPlayer({ ...player, team: v })} />
                <Field label="位置" value={player.role} onChange={(v) => setPlayer({ ...player, role: v })} />
                <Field label="头像路径" value={player.avatar} onChange={(v) => setPlayer({ ...player, avatar: v })} />
              </div>
              <div>
                <Label className="mb-1.5 block">简介</Label>
                <Textarea
                  rows={4}
                  value={player.bio}
                  onChange={(e) => setPlayer({ ...player, bio: e.target.value })}
                />
              </div>

              <HonorEditor
                honors={player.honors}
                onChange={(honors) => setPlayer({ ...player, honors })}
              />
              <GalleryEditor
                items={player.gallery}
                onChange={(gallery) => setPlayer({ ...player, gallery })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 比赛列表 */}
        <TabsContent value="matches">
          <div className="mb-4 flex justify-between">
            <p className="text-sm text-muted-foreground">共 {matches.length} 场比赛</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setMatches([
                    {
                      id: `m${Date.now()}`,
                      date: new Date().toISOString().slice(0, 10),
                      event: "",
                      eventTag: "Tier-1",
                      opponent: "",
                      score: "0:0",
                      result: "win",
                      maps: [{ name: "Mirage", score: "13:10", result: "win", playerStats: { ...EMPTY_MAP_PLAYER_STATS } }],
                    },
                    ...matches,
                  ])
                }
              >
                <Plus className="h-4 w-4" /> 新增比赛
              </Button>
              <Button size="sm" disabled={saving} onClick={() => handleSave(() => saveMatches(matches))}>
                <Save className="h-4 w-4" /> 保存全部
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {matches.map((match, idx) => (
              <MatchEditor
                key={match.id}
                match={match}
                onChange={(m) => setMatches(matches.map((x, i) => (i === idx ? m : x)))}
                onDelete={() => setMatches(matches.filter((_, i) => i !== idx))}
              />
            ))}
          </div>
        </TabsContent>

        {/* 统计数据（自动计算） */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">自动统计预览</CardTitle>
              <p className="text-sm text-muted-foreground">
                根据当前比赛记录实时计算，保存比赛后前台 /stats 会自动更新，无需单独维护 stats.json。
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">战绩统计</Label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    [
                      ["matchWinRate", "系列赛胜率 %"],
                      ["mapWinRate", "地图胜率 %"],
                      ["roundWinRate", "回合胜率 %"],
                      ["totalMatches", "记录场次"],
                      ["totalMaps", "地图局数"],
                      ["avgRoundMargin", "平均净胜回合"],
                      ["closeMapWinRate", "关键局胜率 %"],
                      ["recentForm", "近期状态 %"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="rounded-md border border-border/60 bg-secondary/20 px-3 py-2">
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="font-mono text-sm font-semibold">{stats.overview[key]}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">个人数据（{stats.overview.playerMapsRecorded} 张地图已录入）</Label>
                {stats.overview.playerMapsRecorded > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {(
                      [
                        ["rating", "Rating"],
                        ["kd", "K/D"],
                        ["adr", "ADR"],
                        ["headshotPct", "爆头率 %"],
                        ["kast", "KAST %"],
                        ["multiKillRate", "多杀回合 %"],
                        ["survivalPct", "存活率 %"],
                        ["kpr", "KPR"],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2">
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                        <p className="font-mono text-sm font-semibold text-primary">{stats.overview[key]}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    在比赛 → 地图详情中填写 Rating、K/D 等个人数据后，此处会自动汇总。
                  </p>
                )}
              </div>

              {stats.overview.playerMapsRecorded > 0 && (
                <div>
                  <Label className="mb-3 block">雷达图六维</Label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.radar.map((r) => (
                      <div key={r.subject} className="rounded-md border border-border/60 bg-secondary/20 px-3 py-2">
                        <p className="text-[10px] text-muted-foreground">{r.subject}</p>
                        <p className="font-mono text-sm font-semibold">{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.maps.length > 0 ? (
                <div>
                  <Label className="mb-3 block">各地图数据</Label>
                  <div className="overflow-x-auto rounded-md border border-border/60">
                    <table className="w-full min-w-[400px] text-left text-sm">
                      <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">地图</th>
                          <th className="px-3 py-2">胜率</th>
                          <th className="px-3 py-2">场次</th>
                          <th className="px-3 py-2">{stats.overview.playerMapsRecorded > 0 ? "Rating" : "回合指数"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.maps.map((map) => (
                          <tr key={map.name} className="border-b border-border/40">
                            <td className="px-3 py-2">{map.name}</td>
                            <td className="px-3 py-2">{map.winRate}%</td>
                            <td className="px-3 py-2">{map.played}</td>
                            <td className="px-3 py-2">{map.rating.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">暂无地图数据，请先添加比赛记录。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 原始 JSON */}
        <TabsContent value="raw">
          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                {(["player", "matches"] as const).map((k) => (
                  <Button
                    key={k}
                    size="sm"
                    variant={rawKey === k ? "default" : "outline"}
                    onClick={() => setRawKey(k)}
                  >
                    {k}.json
                  </Button>
                ))}
              </div>
              <Button size="sm" disabled={saving} onClick={saveRaw}>
                <Save className="h-4 w-4" /> 解析并保存
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[420px] font-mono text-xs"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function HonorEditor({
  honors,
  onChange,
}: {
  honors: Honor[];
  onChange: (h: Honor[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>荣誉 honors</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([{ year: new Date().getFullYear(), title: "", event: "" }, ...honors])}
        >
          <Plus className="h-3 w-3" /> 添加
        </Button>
      </div>
      <div className="space-y-2">
        {honors.map((h, i) => (
          <div key={i} className="flex flex-wrap gap-2 rounded border border-border p-3">
            <Input
              type="number"
              className="w-24"
              placeholder="年份"
              value={h.year}
              onChange={(e) =>
                onChange(honors.map((x, j) => (j === i ? { ...x, year: Number(e.target.value) } : x)))
              }
            />
            <Input
              className="flex-1"
              placeholder="标题"
              value={h.title}
              onChange={(e) =>
                onChange(honors.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
              }
            />
            <Input
              className="flex-1"
              placeholder="赛事"
              value={h.event}
              onChange={(e) =>
                onChange(honors.map((x, j) => (j === i ? { ...x, event: e.target.value } : x)))
              }
            />
            <Button variant="ghost" size="icon" onClick={() => onChange(honors.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4 text-esports-red" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryEditor({
  items,
  onChange,
}: {
  items: GalleryItem[];
  onChange: (g: GalleryItem[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>图集 gallery</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([
              { id: `g${Date.now()}`, title: "", src: "/images/gallery/g1.svg", category: "比赛" },
              ...items,
            ])
          }
        >
          <Plus className="h-3 w-3" /> 添加
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((g, i) => (
          <div key={g.id} className="grid gap-2 rounded border border-border p-3 sm:grid-cols-4">
            <Input placeholder="ID" value={g.id} onChange={(e) => patch(items, i, { id: e.target.value }, onChange)} />
            <Input placeholder="标题" value={g.title} onChange={(e) => patch(items, i, { title: e.target.value }, onChange)} />
            <Input placeholder="图片路径" value={g.src} onChange={(e) => patch(items, i, { src: e.target.value }, onChange)} />
            <div className="flex gap-2">
              <Input placeholder="分类" value={g.category} onChange={(e) => patch(items, i, { category: e.target.value }, onChange)} />
              <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4 text-esports-red" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function patch<T>(arr: T[], i: number, partial: Partial<T>, onChange: (a: T[]) => void) {
  onChange(arr.map((x, j) => (j === i ? { ...x, ...partial } : x)));
}

function MatchEditor({
  match,
  onChange,
  onDelete,
}: {
  match: Match;
  onChange: (m: Match) => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <CardTitle className="text-sm">{match.event || "未命名赛事"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-esports-red" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="ID" value={match.id} onChange={(v) => onChange({ ...match, id: v })} />
          <Field label="日期" value={match.date} onChange={(v) => onChange({ ...match, date: v })} />
          <Field label="赛事" value={match.event} onChange={(v) => onChange({ ...match, event: v })} />
          <Field label="标签" value={match.eventTag} onChange={(v) => onChange({ ...match, eventTag: v })} />
          <Field label="对手" value={match.opponent} onChange={(v) => onChange({ ...match, opponent: v })} />
          <ScoreInput label="比分" value={match.score} onChange={(v) => onChange({ ...match, score: v })} />
          <div>
            <Label className="mb-1.5 block">赛果</Label>
            <select
              className="flex h-9 w-full rounded-md border border-border bg-background px-3 text-sm"
              value={match.result}
              onChange={(e) => onChange({ ...match, result: e.target.value as "win" | "loss" })}
            >
              <option value="win">win</option>
              <option value="loss">loss</option>
            </select>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>地图 maps</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...match,
                  maps: [...match.maps, { name: "Mirage", score: "13:10", result: "win", playerStats: { ...EMPTY_MAP_PLAYER_STATS } }],
                })
              }
            >
              <Plus className="h-3 w-3" /> 地图
            </Button>
          </div>
          {match.maps.map((map, mi) => (
            <MapRow
              key={mi}
              map={map}
              onChange={(m) =>
                onChange({ ...match, maps: match.maps.map((x, j) => (j === mi ? m : x)) })
              }
              onDelete={() => onChange({ ...match, maps: match.maps.filter((_, j) => j !== mi) })}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MapRow({
  map,
  onChange,
  onDelete,
}: {
  map: MapResult;
  onChange: (m: MapResult) => void;
  onDelete: () => void;
}) {
  return (
    <div className="mb-3 overflow-hidden rounded-md border border-border/60">
      <MapSelect
        value={map.name}
        onChange={(name) => onChange({ ...map, name })}
        showPreview
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 bg-secondary/20 p-2">
        <ScoreInput
          compact
          label="比分"
          value={map.score}
          onChange={(score) => onChange({ ...map, score })}
        />
        <div>
          <Label className="mb-1 block normal-case text-[10px]">赛果</Label>
          <select
            className="flex h-8 rounded-md border border-border bg-background px-2 text-sm"
            value={map.result}
            onChange={(e) => onChange({ ...map, result: e.target.value as "win" | "loss" })}
          >
            <option value="win">胜</option>
            <option value="loss">负</option>
          </select>
        </div>
        <Button variant="ghost" size="icon" className="mt-5" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-esports-red" />
        </Button>
      </div>
      <MapPlayerStatsEditor
        value={map.playerStats}
        mapScore={map.score}
        onChange={(playerStats) => onChange({ ...map, playerStats })}
      />
    </div>
  );
}
