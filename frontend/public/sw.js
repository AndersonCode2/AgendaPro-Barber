// frontend/public/sw.js
const CACHE_NAME = "aurum-cache-v1";

self.addEventListener("install", () => {
  console.log("💎 [AURUM PWA] Service Worker Instalado");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("💎 [AURUM PWA] Service Worker Ativado");
});

self.addEventListener("fetch", (event) => {
  // Apenas passa a requisição adiante. 
  // Isso é o suficiente para o Chrome reconhecer como um Aplicativo Instalável.
  event.respondWith(fetch(event.request).catch(() => new Response("Você está offline.")));
});