export default class AddStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async addStory(formData) {
    try {
      await this.#model.addStory(formData);
      this.#view.addSuccess("Succesfully add story!");
    } catch (error) {
      this.#view.addFailed("Failed to add story");
    }
  }


}
