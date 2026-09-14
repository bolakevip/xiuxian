export async function onRequestGet(context) {
  const { env } = context;
  try {
    const data = await env.XIUXIAN_KV.get("default-save", { type: "json" });
    return new Response(JSON.stringify({ state: data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ state: null }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    if (!body || !body.data) {
      return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
    }
    await env.XIUXIAN_KV.put("default-save", JSON.stringify(body.data));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }
}
