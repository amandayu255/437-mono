import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface RegisterFormData {
  username?: string;
  password?: string;
}

export class RegisterFormElement extends LitElement {
  @property() api?: string;
  @property() redirect: string = "/";
  @state() formData: RegisterFormData = {};
  @state() error?: string;

  get canSubmit() {
    return this.formData.username && this.formData.password;
  }

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 300px;
      margin: auto;
    }

    .error {
      color: red;
    }
  `;

  render() {
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

    if (name === "username" || name === "password") {
      this.formData = { ...prevData, [name]: value };
    }
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!this.canSubmit || !this.api) return;

    fetch(this.api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData),
    })
      .then((res) => {
        if (res.status !== 201) throw new Error("Registration failed");
        return res.json();
      })
      .then(({ token }) => {
        this.dispatchEvent(
          new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, redirect: this.redirect }],
          })
        );
      })
      .catch((err) => {
        this.error = err.message;
      });
  }
}

customElements.define("register-form", RegisterFormElement);
