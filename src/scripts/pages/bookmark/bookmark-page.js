import BookmarkPresenter from "./bookmark-presenter";
import Database from "../../data/database";

export default class BookmarkPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Bookmarked Stories</h1>
        <div id="bookmark-list"></div>
        <div id="bookmark-list-loading"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.init();
    document.querySelectorAll(".story-card").forEach((storyCard) => {
      storyCard.addEventListener("click", (event) => {
        const storyId = event.currentTarget.dataset.storyId;
        console.log("Clicked story ID:", storyId);
        location.hash = `/detail/${storyId}`;
      });
    });
  }

  showBookmarks(stories) {
    if (!stories || stories.length === 0) {
      this.showEmptyMessage();
      return;
    }
    const html = stories
      .map(
        (story) => `
    <div class="story-card" data-story-id="${story.id}">
      <img src="${story.photoUrl}" alt="Story image" />
      <div class="story-content">
        <h3>${story.name}</h3>
        <p class="created-at">Created at: ${story.createdAt}</p>
        <p class="description">${story.description}</p>
      </div>
      <div class="story-map" id="map-${story.id}" style="height: 200px; margin-top: 10px;"></div>
    </div>
  `
      )
      .join("");

    document.getElementById("bookmark-list").innerHTML = html;
  }


  showEmptyMessage() {
    document.getElementById("bookmark-list").innerHTML = `
      <p class="text-gray-500 text-center mt-10">No bookmarked stories yet.</p>
    `;
  }

  showError(message = "Something went wrong!") {
    document.getElementById("bookmark-list").innerHTML = `
      <p class="text-red-500 text-center mt-10">${message}</p>
    `;
  }

  showLoading() {
    document.getElementById("bookmark-list-loading").innerHTML = `
      <div class="loader text-center mt-5">Loading...</div>
    `;
  }

  hideLoading() {
    document.getElementById("bookmark-list-loading").innerHTML = "";
  }
}
