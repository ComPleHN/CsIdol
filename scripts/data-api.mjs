/**
 * 本地数据 API 服务
 * ==================
 * 静态导出（GitHub Pages）无法在浏览器里直接写文件，
 * 因此 Admin 页面在本地开发时通过本服务读写 src/app/data/*.json。
 *
 * 启动：npm run dev（会自动连同 Next.js 一起启动）
 * 单独启动：npm run data-api
 *
 * 默认端口：3456
 * 可选环境变量：DATA_API_PORT、ADMIN_TOKEN（设置后需在请求头带 Authorization: Bearer <token>）
 */

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src/app/data");

const FILES = {
  player: join(DATA_DIR, "player.json"),
  matches: join(DATA_DIR, "matches.json"),
};

const PORT = Number(process.env.DATA_API_PORT || "3456");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

function loadEnvLocal() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();
const token = process.env.ADMIN_TOKEN || ADMIN_TOKEN;

function readJson(key) {
  const path = FILES[key];
  if (!path || !existsSync(path)) {
    throw new Error(`未知数据文件: ${key}`);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(key, data) {
  const path = FILES[key];
  if (!path) throw new Error(`未知数据文件: ${key}`);
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) return resolve(null);
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("JSON 格式无效"));
      }
    });
    req.on("error", reject);
  });
}

function checkAuth(req) {
  if (!token) return true;
  const auth = req.headers.authorization || "";
  return auth === `Bearer ${token}`;
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const parts = url.pathname.split("/").filter(Boolean);

  // GET /api/health
  if (req.method === "GET" && parts.join("/") === "api/health") {
    sendJson(res, 200, { ok: true, port: PORT, authRequired: Boolean(token) });
    return;
  }

  // /api/:key  key = player | matches
  if (parts[0] === "api" && parts[1] && FILES[parts[1]]) {
    const key = parts[1];

    if (!checkAuth(req)) {
      sendJson(res, 401, { error: "未授权，请配置 ADMIN_TOKEN" });
      return;
    }

    try {
      if (req.method === "GET") {
        sendJson(res, 200, readJson(key));
        return;
      }

      if (req.method === "PUT") {
        const body = await parseBody(req);
        if (body == null) {
          sendJson(res, 400, { error: "请求体为空" });
          return;
        }
        writeJson(key, body);
        sendJson(res, 200, { ok: true, message: `${key}.json 已保存` });
        return;
      }
    } catch (err) {
      sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
      return;
    }
  }

  sendJson(res, 404, { error: "Not Found" });
});

server.listen(PORT, () => {
  console.log(`[data-api] 本地数据服务 http://localhost:${PORT}`);
  console.log(`[data-api] 读写目录: ${DATA_DIR}`);
  if (token) console.log("[data-api] 已启用 ADMIN_TOKEN 鉴权");
});
