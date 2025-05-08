import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class MusicaCardElement extends LitElement {
  @property() title = "";
  @property() artist = "";
  @property() album = "";
  @property() cover = "";
  @property() href = "";

  static styles = css`
  :host {
    display: block;
    background: white;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
    padding: 1rem;
    margin-bottom: 1rem;
    transition: transform 0.2s ease;
  }

  :host(:hover) {
    transform: translateY(-2px);
  }

  .card {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 8px;
  }

  .info {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .artist {
    font-size: 0.95rem;
  }

  .album {
    font-size: 0.9rem;
    font-style: italic;
    color: #666;
  }
`;


render() {
    return html`
      <div class="card">
        <img src="${this.cover}" alt="${this.title} Cover" />
        <div class="info">
          <div class="title">${this.title}</div>
          <div class="artist">${this.artist}</div>
          <div class="album">${this.album}</div>
        </div>
      </div>
    `;
  }
  

}

customElements.define("musica-card", MusicaCardElement);
