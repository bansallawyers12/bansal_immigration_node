const created = await fetch("http://127.0.0.1:9333/json/new?http://localhost:3001/", { method: "PUT" });
let page = await created.json();
if (!page.webSocketDebuggerUrl) {
  const pages = await (await fetch("http://127.0.0.1:9333/json")).json();
  page = pages.find((p) => p.type === "page");
}

console.log("page", page.url, page.title);
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

function send(method, params = {}) {
  const msgId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
});

await new Promise((resolve) => ws.addEventListener("open", resolve));
await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
const nav = await send("Page.navigate", { url: "http://localhost:3001/" });
console.log("navigate", JSON.stringify(nav));
await new Promise((resolve) => setTimeout(resolve, 7000));

const result = await send("Runtime.evaluate", {
  expression: `(() => {
    const btn = document.querySelector('button[aria-label="Open navigation menu"]');
    if (!btn) return JSON.stringify({ title: document.title, href: location.href, text: document.body?.innerText?.slice(0, 300) });
    const before = btn.getAttribute('aria-expanded');
    btn.click();
    const after = btn.getAttribute('aria-expanded');
    const panel = [...document.querySelectorAll('header div')].find((el) => (el.innerText || '').includes('Our Services') && (el.innerText || '').includes('Company'));
    const rect = panel ? panel.getBoundingClientRect() : null;
    const style = panel ? getComputedStyle(panel) : null;
    return JSON.stringify({
      before,
      after,
      panelVisible: !!(rect && rect.height > 0 && style.display !== 'none'),
      rect,
      display: style && style.display,
      position: style && style.position,
      top: style && style.top,
      zIndex: style && style.zIndex,
      headerText: document.querySelector('header')?.innerText?.slice(0, 400)
    });
  })()`,
  returnByValue: true,
});

console.log(result.result.value);
ws.close();
