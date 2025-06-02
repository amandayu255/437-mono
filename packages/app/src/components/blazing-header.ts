import { LitElement, html, css } from "lit";

export class HeaderElement extends LitElement {
  static styles = css`
    header {
      padding: 1rem 2rem;
      background: #fff;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "Karla", sans-serif;
    }

    h1 {
      font-size: 1.5rem;
    }

    ::slotted(*) {
      margin-left: auto;
    }
  `;

  static initializeOnce() {}

  render() {
    return html`
      <header>
        <h1>🎵 Musica</h1>
        <slot name="actuator"></slot>
      </header>
    `;
  }
}

customElements.define("blazing-header", HeaderElement);
