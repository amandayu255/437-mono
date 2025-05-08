import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface Song {
  title: string;
  artist: string;
  album: string;
  cover: string;
  link: string;
}

export class MusicaViewerElement extends LitElement {
  @property() src?: string;
  @state() songs: Song[] = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  async hydrate(src: string) {
    const res = await fetch(src);
    const json = await res.json();
    this.songs = json as Song[];
  }

  renderSong(song: Song) {
    return html`
      <musica-card
        title=${song.title}
        artist=${song.artist}
        album=${song.album}
        cover=${song.cover}
        href=${song.link}
      ></musica-card>
    `;
  }

  render() {
    return html`
      <section>${this.songs.map((song) => this.renderSong(song))}</section>
    `;
  }

  static styles = css`
    section {
      display: grid;
      gap: 1rem;
    }
  `;
}

customElements.define("musica-viewer", MusicaViewerElement);
