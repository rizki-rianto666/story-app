import RegisterPresenter from "./register-presenter";
import * as authModel from "../../../models/auth-model";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
    <section id="register-section">
        <form aria-label="Registration Form" id="regist-form">
            <div>
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required />
            </div>

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

            <button type="submit">Register</button>
        </form>
    </section>
        `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: authModel,
    });

    this.#setForm();
  }

  #setForm() {
    document
      .getElementById("regist-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
        };
        console.log(data)
        await this.#presenter.register(data);
      });
  }

  
  registerSuccess(message) {
    alert(message);

    location.hash = "/login";
  }

  registerFailed(message) {
    console.error(message);
    alert(message);
  }
}
