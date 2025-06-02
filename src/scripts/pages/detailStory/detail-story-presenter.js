export default class DetailStoryPresenter {
  #view;
  #model;
  #dbModel;
  #storyId;

  constructor(storyId, { view, model, dbModel }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
    this.#storyId = storyId;
  }

  async getStory() {
    try {
      return await this.#model.getStory(this.#storyId);
    } catch (error) {
      this.#view.getErrorMessage(
        `Failed to see detail story: ${error.message}`
      );
    }
  }

  async saveBookmark(imgEl) {
    try {
      const isSaved = await this.isStorySaved();
      if (isSaved) {
        this.#dbModel.removeStory(this.#storyId);
        // this.#view.removeBookmarkSuccessfully()

        imgEl.src = `/images/bookmark.png?${Date.now()}`;

        alert("Bookmark removed successfully!");
      } else {
        const story = await this.getStory(this.#storyId);
        console.log("Story to bookmark", story);
        await this.#dbModel.putStory(story.story);
        imgEl.src = `/images/bookmark_filled.svg?${Date.now()}`;

        console.log(imgEl);
        this.#view.saveToBookmarkSuccessfully("Success to save to bookmark");
      }
    } catch (error) {
      console.error("saveReport: error:", error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async isStorySaved() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
