import { html, css, LitElement } from "lit";

export class MusicaLinkElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--font-family-base, sans-serif);
      margin-bottom: 1rem;
    }

    .card {
      display: block;
      padding: 1.25rem;
      border: 1.5px solid var(--color-border);
      border-radius: 12px;
      background-color: var(--color-background-header);
      color: var(--color-text-default);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s ease, box-shadow 0.3s ease;
      text-decoration: none;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
      background-color: var(--color-link-hover);
    }

    .label {
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--color-text-default);
    }
  `;

  static properties = {
    href: { type: String },
    label: { type: String },
  };

  href = "#";
  label = "";

  render() {
    return html`
      <a class="card" href=${this.href}>
        <div class="label">${this.label}</div>
      </a>
    `;
  }
}
