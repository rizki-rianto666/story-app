import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { setupSkipToContent, transitionHelper } from "../utils";
import {
  isCurrentPushSubscriptionAvailable,
  isServiceWorkerAvailable,
  subscribe,
} from "../utils/push-notification";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    this._setupDrawer();
    setupSkipToContent(this.#skipLinkButton, this.#content);
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  // Push notif
  #handleSubsClick = async () => {
    await subscribe();
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    const subsButton = document.getElementById("subs-button");
    subsButton.innerHTML = isSubscribed ? "Unsubscribe" : "Subscribe";
  };

  async #setupPushNotification() {
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    const subsButton = document.getElementById("subs-button");

    subsButton.innerHTML = isSubscribed ? "Unsubscribe" : "Subscribe";

    const newButton = subsButton.cloneNode(true);
    subsButton.replaceWith(newButton);

    newButton.addEventListener("click", this.#handleSubsClick);
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];
    const page = route();
    if (!page) {
      location.reload();
    }
    // Go to Bookmark Button
    document.getElementById('bookmark').addEventListener('click', ()=>{
      location.hash = '/bookmark'
    });

    const transition = transitionHelper({
      updateDOM: async () => {
        const newHTML = await page.render();

        // Pastikan newHTML hanya berisi child dari <main>
        const temp = document.createElement("div");
        temp.innerHTML = newHTML;

        // Ganti isi <main>, bukan <main>-nya
        this.#content.replaceChildren(...temp.childNodes);

        await page.afterRender();
      },
    });

    transition.ready?.catch(console.error);

    transition.updateCallbackDone?.then(() => {
      scrollTo({ top: 0, behavior: "smooth" });

      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });

    if (!document.startViewTransition) {
      await page.afterRender();
      scrollTo({ top: 0 });
    }
  }
}

export default App;
