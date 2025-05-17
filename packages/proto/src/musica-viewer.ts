import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { Observer } from "@calpoly/mustang";
import type { Auth } from "@calpoly/mustang";

interface Song {
  title: string;
  artist: string;
  album: string;
  cover: string;
  link: string;
}

interface AuthUser extends Auth.User {
  token: string;
}

export class MusicaViewerElement extends LitElement {
  @property() src?: string;
  @state() songs: Song[] = [];

  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth) => {
      this._user = auth.user;
      if (this.src) this.hydrate(this.src);
    });
  }

  get authorization() {
    return this._user?.authenticated
      ? { Authorization: `Bearer ${(this._user as AuthUser).token}` }
      : undefined;
  }

  async hydrate(src: string) {
    const res = await fetch(src, {
      headers: this.authorization,
    });
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
