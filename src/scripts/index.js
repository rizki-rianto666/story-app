// CSS imports
import "../styles/styles.css";
import Camera from "./camera";

import App from "./pages/app";
import { updateAuthLinks } from "./utils";
import {
  registerServiceWorker,
} from "./utils/push-notification";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
    skipLinkButton: document.querySelector("#skip-link"),
  });
  updateAuthLinks();
  await app.renderPage();
  await registerServiceWorker();

  window.addEventListener("hashchange", async () => {
    updateAuthLinks();
    await app.renderPage();
    Camera.stopAllStreams();
  });
});
