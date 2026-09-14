import { getStore } from "@netlify/blobs";

const STORE_NAME = "xiuxian-saves";
const SAVE_KEY = "default-save";

export default async (req, context) => {
  const url = new URL(req.url);
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // GET：读取云端存档
  if (req.method === "GET") {
    const entry = await store.get(SAVE_KEY, { type: "json" });
    if (!entry) {
      return new Response(JSON.stringify({ state: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ state: entry }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST：写入云端存档
  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (!body || !body.data) {
        return new Response(JSON.stringify({ error: "Missing data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      await store.setJSON(SAVE_KEY, body.data);
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  path: "/.netlify/functions/sync",
};
