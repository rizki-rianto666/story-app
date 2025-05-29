import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { setupSkipToContent, transitionHelper } from "../utils";

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

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];
    const page = route();
    console.log(route)
    console.log(page)
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
      scrollTo({ top: 0 });
    });

    if (!document.startViewTransition) {
      await page.afterRender();
      scrollTo({ top: 0 });
    }
  }
}

export default App;
