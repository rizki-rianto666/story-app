import { putAccessToken, putUser } from "../../../models/auth-model";

export default class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

 async login({ email, password }) {
  try {
    const response = await this.#model.getLoginModel({ email, password });

    if (response.error) {
      this.loginFailed(response.message || "Login gagal.");
      return;
    }

    const token = response.loginResult?.token;
    const name = response.loginResult?.name;

    if (!token || !name) {
      this.#view.loginFailed("Login gagal: Token atau nama tidak ditemukan.");
      return;
    }

    putAccessToken(token);
    putUser(name);
    this.#view.loginSuccess(response.message);
  } catch (error) {
    this.#view.loginFailed("Terjadi kesalahan: " + error.message);
  }
}



}
