export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async register({ name, email, password }) {
    try {
      const response = await this.#model.getRegisterModel({
        name,
        email,
        password,
      });

      if (!response.ok) {
        this.#view.registerFailed(response.message);
      }

      this.#view.registerSuccess(response.message);
    } catch (error) {
      this.#view.registerFailed(error);
    } finally {
    }
  }

}
