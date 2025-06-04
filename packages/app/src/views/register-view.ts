import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../auth/register-form";

@customElement("register-view")
export class RegisterViewElement extends LitElement {
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
        <h2>Register New Account</h2>
        <register-form api="/auth/register">
          <label>
            <span>Username:</span>
            <input name="username" autocomplete="off" />
          </label>
          <label>
            <span>Password:</span>
            <input type="password" name="password" />
          </label>
        </register-form>
        <p>
          Already have an account?
          <a href="/login">Back to login</a>
        </p>
      </main>
    `;
  }
}
