import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface Song {
  title: string;
  artist: string;
  albumArt: string;
}

export class PlaylistViewElement extends LitElement {
  @property({ attribute: "playlist-id" }) playlistId = "";
  @state() songs: Song[] = [];

  static styles = css`
    .container {
      padding: 1rem;
    }

    .song {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .song img {
      width: 64px;
      height: 64px;
      object-fit: cover;
    }

    .song-details {
      display: flex;
      flex-direction: column;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadSongs();
  }

  async loadSongs() {
    const res = await fetch(`/api/playlists/${this.playlistId}`);
    if (res.ok) {
      const json = await res.json();
      this.songs = json.songs;
    }
  }

  render() {
    return html`
      <div class="container">
        <h2>Playlist: ${this.playlistId}</h2>
        ${this.songs.map(
          (song) => html`
            <div class="song">
              <img src=${song.albumArt} />
              <div class="song-details">
                <strong>${song.title}</strong>
                <span>${song.artist}</span>
              </div>
            </div>
          `
        )}
        <p><a href="/app">← Back</a></p>
      </div>
    `;
  }
}

customElements.define("playlist-view", PlaylistViewElement);
