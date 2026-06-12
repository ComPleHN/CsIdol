/** 解析 "13:10"、"13-10" 等为 [左, 右] */
export function parseScore(score: string): [string, string] {
  const trimmed = score.trim();
  const matched = trimmed.match(/^(\d+)\s*[-:：]\s*(\d+)$/);
  if (matched) return [matched[1], matched[2]];
  return ["0", "0"];
}

/** 格式化为 "X:Y"，空侧在提交时用 "0" */
export function formatScore(left: string, right: string): string {
  const a = left.replace(/\D/g, "") || "0";
  const b = right.replace(/\D/g, "") || "0";
  return `${a}:${b}`;
}
