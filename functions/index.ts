export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/submissions" && request.method === "GET") {
      const list = await env.SUBMISSIONS_KV.list({ prefix: "submission:" });
      const values = await Promise.all(
        list.keys.map((entry) => env.SUBMISSIONS_KV.get(entry.name))
      );
      const parsed = values.filter(Boolean).map(JSON.parse);
      return new Response(JSON.stringify(parsed, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (path === "/api/submit" && request.method === "POST") {
      const name = await request.text();
      const submittedAt = new Date().toISOString();
      const record = { name, submittedAt };
      const key = `submission:${Date.now()}`;
      await env.SUBMISSIONS_KV.put(key, JSON.stringify(record));
      return new Response(
        JSON.stringify({ message: `Thanks, ${name}!` }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const files = {
      '/': { content: html, type: 'text/html' },
      '/style.css': { content: css, type: 'text/css' },
      '/main.js': { content: js, type: 'application/javascript' },
    };

    const file = files[path] || files['/'];
    return new Response(file.content, {
      headers: { 'Content-Type': file.type },
    });
  },
};
