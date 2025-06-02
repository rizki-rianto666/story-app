import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import CONFIG from "./config";

const STORY_APP_BASE_URL = CONFIG.STORY_APP_BASE_URL;

// pre-caching
precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching
registerRoute(
  ({ url }) => {
    return (
      url.origin === "https://fonts.googleapis.com" ||
      url.origin === "https://fonts.gstatic.com"
    );
  },
  new CacheFirst({
    cacheName: "google-fonts",
  })
);

registerRoute(
  ({ url }) => {
    return (
      url.origin === "https://cdnjs.cloudflare.com" ||
      url.origin.includes("fontawesome")
    );
  },
  new CacheFirst({
    cacheName: "fontawesome",
  })
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(STORY_APP_BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== "image";
  },
  new NetworkFirst({
    cacheName: "story-api",
  })
);

registerRoute(
  ({ url }) => {
    const baseUrl = new URL(STORY_APP_BASE_URL);
    return (
      baseUrl.origin === url.origin &&
      url.pathname.startsWith("/v1/stories/") &&
      url.pathname.split("/").length === 4 
    );
  },
  new NetworkFirst({
    cacheName: "story-detail-api",
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 0 * 24 * 60 * 60, 
      }),
    ],
  })
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(STORY_APP_BASE_URL);
    return baseUrl.origin === url.origin && request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "story-api-images",
  })
);
registerRoute(
  ({ url }) => {
    return url.origin.includes("openstreetmap");
  },
  new CacheFirst({
    cacheName: "osm-api",
  })
);

self.addEventListener("push", (event) => {
  console.log("Service worker pushing...");
  async function chainPromise() {
    const data = await event.data.json();

    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(chainPromise());
});
