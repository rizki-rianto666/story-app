export default class DetailStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getStory(id) {
    try {
      return await this.#model.getStory(id);
    } catch (error) {
      this.#view.getErrorMessage(
        `Failed to see detail story: ${error.message}`
      );
    }
  }
}
