import type { Match, Player } from "@/app/types";

/** 本地数据 API 地址（与 scripts/data-api.mjs 对应） */
export const DATA_API_URL =
  process.env.NEXT_PUBLIC_DATA_API_URL || "http://localhost:3456";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${DATA_API_URL}${path}`, {
    ...init,
    headers: { ...getHeaders(), ...init?.headers },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new AdminApiError(body.error || res.statusText, res.status);
  }

  return body as T;
}

/** 检测本地 data-api 是否在线 */
export async function checkDataApi(): Promise<boolean> {
  try {
    await request<{ ok: boolean }>("/api/health");
    return true;
  } catch {
    return false;
  }
}

export function fetchPlayer() {
  return request<Player>("/api/player");
}

export function savePlayer(data: Player) {
  return request<{ ok: boolean; message: string }>("/api/player", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function fetchMatches() {
  return request<Match[]>("/api/matches");
}

export function saveMatches(data: Match[]) {
  return request<{ ok: boolean; message: string }>("/api/matches", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
