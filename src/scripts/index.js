// CSS imports
import "../styles/styles.css";
import Camera from "./camera";
import { getAccessToken } from "./models/auth-model";

import App from "./pages/app";
import { updateAuthLinks } from "./utils";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
    skipLinkButton: document.querySelector("#skip-link"),
  });
  updateAuthLinks();
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    updateAuthLinks();
    await app.renderPage();
    Camera.stopAllStreams();
  });
});
