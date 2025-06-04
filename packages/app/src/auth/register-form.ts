import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface RegisterFormData {
  username?: string;
  password?: string;
}

export class RegisterFormElement extends LitElement {
  @state()
  formData: RegisterFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  error?: string;

  get canSubmit(): boolean {
    return Boolean(
      this.api && this.formData.username && this.formData.password
    );
  }

  static styles = css`
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 320px;
      margin: auto;
      padding: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: 600;
      font-size: 0.9rem;
      gap: 0.5rem;
    }

    input {
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    button {
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error {
      color: var(--color-error, red);
      font-weight: bold;
      text-align: center;
    }
  `;

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
    }
  }

  handleSubmit(submitEvent: SubmitEvent) {
    submitEvent.preventDefault();

    if (this.canSubmit) {
      fetch(this?.api || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formData),
      })
        .then((res) => {
          if (res.status !== 201) throw "Registration failed";
          else return res.json();
        })
        .then((json: object) => {
          const { token } = json as { token: string };
          this.dispatchEvent(
            new CustomEvent("auth:message", {
              bubbles: true,
              composed: true,
              detail: ["auth/signin", { token, redirect: this.redirect }],
            })
          );
        })
        .catch((error: Error) => {
          this.error = error.toString();
        });
    }
  }
}

customElements.define("register-form", RegisterFormElement);
