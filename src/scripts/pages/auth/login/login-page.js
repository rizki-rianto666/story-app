import LoginPresenter from "./login-presenter";
import * as authModel from "../../../models/auth-model";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
    <section id="login-section">
        <form aria-label="Login Form" id="login-form">
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required />
            </div>

            <div>
                <label for="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    minlength="8" 
                    required 
                    aria-describedby="passwordHelp"
                />
                <small id="passwordHelp">Password must be at least 8 characters long.</small>
            </div>

            <button type="submit">Login</button>
            <p>Or <a href="#/register">Register</a> if you don't have account</p>
           
        </form>
    </section>
        `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: authModel,
    });

    this.#setForm();
  }

  #setForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        };
        await this.#presenter.login(data);
      });
  }

  loginSuccess(message) {
    alert(message);

    location.hash = "/";
  }

  loginFailed(message) {
    console.error(message);
    alert(message);
  }
}
