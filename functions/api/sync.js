// Cloudflare Pages Functions - 云端存档同步
// 路径：functions/api/sync.js
// 对应前端请求：/api/sync

const KV_KEY = "default-save";

// GET：读取存档
export async function onRequestGet(context) {
  const { env } = context;
  try {
    const data = await env.XIUXIAN_KV.get(KV_KEY, { type: "json" });
    return new Response(JSON.stringify({ state: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ state: null }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST：写入存档，或删除存档（data 为 null 时）
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();

    // data === null → 删除存档
    if (body && body.data === null) {
      await env.XIUXIAN_KV.delete(KV_KEY);
      return new Response(JSON.stringify({ ok: true, deleted: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 没有 data 字段 → 返回 400
    if (!body || !body.data) {
      return new Response(JSON.stringify({ error: "Missing data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 正常写入
    await env.XIUXIAN_KV.put(KV_KEY, JSON.stringify(body.data));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
