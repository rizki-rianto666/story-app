import { getStory } from "../../models/stories-model";
import DetailStoryPresenter from "./detail-story-presenter";
import * as storiesModel from "../../models/stories-model";
import Database from "../../data/database";

export default class detailStoryPage {
  #presenter;
  async render() {
    return `
        <section id="detail-card">

            <div id='card-info'>

            </div>

            <div id="map">
            
            </div>
        </section>
        `;
  }

  async afterRender() {
    const url = new URL(location);
    const id = url.hash.split("/")[2];

    this.#presenter = new DetailStoryPresenter(id, {
      view: this,
      model: storiesModel,
      dbModel: Database,
    });

    const story = await this.#presenter.getStory();

    if (!story.error) {
      await this.#populateDetailCard(story.story);
      await this.#setMap(story.story);
      return;
    }

    await this.#populateDetailCard(story);
  }

  async #populateDetailCard(story) {
    if (story.error) {
      const errorPage = `
      <div class="error-page">
        <div class="error-title">404</div>
        <div class="error-subtitle">Page Not Found</div>
        <div class="error-message">
          <p>Sorry, there's an Error.... I guess... ?😣</p>
          <p>Please reload the page</p>
        </div>
      </div>
      `;
      document.getElementById("card-info").innerHTML = errorPage;
      return;
    }
    const isStorySaved = await this.#presenter.isStorySaved()
    const storyHTML = `
        <div class="detail-story-card" data-story-id='${story.id}'>
            <img src="${story.photoUrl}" alt="Story image">
            <div class="detail-story-content">
                <h3>${story.name}</h3>
                <p class="detail-created-at">Created at: ${story.createdAt}</p>
                <p class="detail-description">${story.description}</p>
            </div>
            <button id="save-bookmark">
              <img class="bookmark-img" src="./images/${
                isStorySaved
                  ? "bookmark_filled.svg"
                  : "bookmark.png"
              }" alt="save story to bookmark">
            </button>
        </div>
    `;
    document.getElementById("card-info").innerHTML = storyHTML;
    document
      .getElementById("save-bookmark")
      .addEventListener("click", async () => {
        const imgEl = document.querySelector('.bookmark-img')
        await this.#presenter.saveBookmark(imgEl);
      });
  }
  async #setMap(story) {
    if (story.lat && story.lon) {
      const mapContainer = document.getElementById("map");

      if (mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }

      const map = L.map("map").setView([story.lat, story.lon], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(story.name)
        .openPopup();
    }
  }

  getErrorMessage(msg) {
    alert(msg);
  }

  saveToBookmarkSuccessfully() {
    alert("Story Bookmarked!");
  }
  saveToBookmarkFailed(message) {
    alert(message);
  }

}
