import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer, Events } from "@calpoly/mustang";

interface AuthStatus {
  user?: {
    authenticated: boolean;
    username: string;
    [key: string]: unknown;
  };
}

export class HeaderElement extends LitElement {
  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: var(--color-background, #eee);
      border-bottom: 1px solid #ccc;
    }

    nav a,
    nav button {
      margin-left: 1rem;
      font-size: 1rem;
      background: none;
      border: none;
      color: var(--color-primary, #333);
      cursor: pointer;
    }

    [slot="actuator"] {
      font-weight: bold;
    }
  `;

  _authObserver = new Observer(this, "blazing:auth");

  loggedIn = false;
  userid?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth: AuthStatus) => {
      const { user } = auth;
      if (user?.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

  renderSignOutButton() {
    return html`
      <button
        @click=${(e: Event) =>
          Events.relay(e, "auth:message", ["auth/signout"])}
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html`<a href="/login.html">Sign In…</a>`;
  }

  render() {
    return html`
      <header>
        <a slot="actuator"> Hello, ${this.userid || "musicas"} </a>
        <nav>
          ${this.loggedIn
            ? this.renderSignOutButton()
            : this.renderSignInButton()}
        </nav>
      </header>
      <slot></slot>
    `;
  }

  static initializeOnce() {}
}

customElements.define("blz-header", HeaderElement);
