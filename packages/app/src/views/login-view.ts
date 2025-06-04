import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../auth/login-form";

@customElement("login-view")
export class LoginViewElement extends LitElement {
  static styles = css`
    main {
      max-width: 500px;
      margin: auto;
      padding: 2rem;
    }
    h2 {
      text-align: center;
    }
  `;

  render() {
    return html`
      <main>
        <h2>User Login</h2>
        <login-form api="/auth/login">
          <label>
            <span>Username:</span>
            <input name="username" autocomplete="off" />
          </label>
          <label>
            <span>Password:</span>
            <input type="password" name="password" />
          </label>
        </login-form>
        <p>
          Or did you want to
          <a href="/register">Sign up as a new user</a>?
        </p>
      </main>
    `;
  }
}
