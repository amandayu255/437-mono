import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";

export class MusicaLinkElement extends LitElement {
  override render() {
    const href = this.getAttribute("href") ?? "#";
    const label = this.getAttribute("label") ?? "";

    return html`
      <li>
        <a href="${href}">${label}</a>
      </li>
    `;
  }

  static styles = [
    reset.styles,
    css`
    :host {
      display: block;
      font-family: var(--font-family-base, sans-serif);
    }

    li {
      list-style: none; /* 🚫 removes the bullet point */
    }

    a {
      color: var(--color-link);
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease, transform 0.2s ease;
    }

    a:hover {
      color: var(--color-link-hover);
      transform: scale(1.05);
      text-decoration: underline;
    }
  `];
}

customElements.define("musica-link", MusicaLinkElement);
