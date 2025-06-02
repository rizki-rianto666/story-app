import * as storiesModel from "../../models/stories-model";

export default class HomePage {

  async render() {
    return `
      <section class="container">
        <div class="stories-container">

        </div>

      </section>
    `;
  }

  async afterRender() {
    await this.#setHomePage();
  }

  async #setHomePage() {
    const storiesContainer = document.querySelector(".stories-container");
    const storiesHTML = await this.populateStories();

    storiesContainer.innerHTML = storiesHTML;

    storiesContainer.innerHTML = storiesHTML;

    document.querySelectorAll(".story-card").forEach((storyCard) => {
      storyCard.addEventListener("click", (event) => {
        const storyId = event.currentTarget.dataset.storyId;
        console.log("Clicked story ID:", storyId);
        location.hash = `/detail/${storyId}`;
      });
    });
  }

  async populateStories() {
    const allStories = await storiesModel.getAllStories();
    if(allStories.error){
      const errorPage = `
      <div class="error-page">
        <div class="error-title">404</div>
        <div class="error-subtitle">Page Not Found</div>
        <div class="error-message">
          <p>Sorry, there's an Error.... I guess... ?😣</p>
          <p>Please reload the page</p>
        </div>
      </div>
      `
      return errorPage

    }
    
    const storiesHTML = allStories.listStory.reduce((acc, story) => {
      return (
        acc +
        `
    <div class="story-card" data-story-id='${story.id}'>
      <img src="${story.photoUrl}" alt="Story image">
      <div class="story-content">
        <h3>${story.name}</h3>
        <p class="created-at">Created at: ${story.createdAt}</p>
        <p class="description">${story.description}</p>
      </div>
    </div>
  `
      );
    }, "");

    return storiesHTML;
  }
}
