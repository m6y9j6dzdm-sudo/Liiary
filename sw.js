// Service worker mínimo — necessário para o navegador considerar o Liary
// um PWA instalável. Não faz cache agressivo (a planilha precisa ser
// sempre lida ao vivo), só garante que o app "responde" offline com uma
// mensagem simples, e deixa passar tudo o mais direto para a rede.
const CACHE_NAME = "liary-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // A planilha (Apps Script) e chamadas de API sempre vão direto pra rede.
  if (event.request.url.includes("script.google.com")) return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(
        (cached) =>
          cached ||
          new Response("Você está offline e esta página ainda não foi carregada antes.", {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
      )
    )
  );
});
