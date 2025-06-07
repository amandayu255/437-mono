import { html, css } from "lit";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";
import { state } from "lit/decorators.js";
import type { Song } from "server/models";

export class SongAddElement extends View<Model, Msg> {
  @state() selectedAlbum = "";
  @state() selectedGenre = "";
  @state() songs: Song[] = [];
  darkMode = localStorage.getItem("dark-mode") === "true";

  constructor() {
    super("musica:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["albums/load", {}]);
    this.dispatchMessage(["genres/load", {}]);
  }

  async loadSongs() {
    try {
      const res = await fetch("/api/songs");
      if (!res.ok) throw new Error("Failed to fetch songs");
      this.songs = await res.json();
    } catch (err) {
      console.error("Error loading songs:", err);
    }
  }

  logout() {
    localStorage.removeItem("token");
    const event = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout", { redirect: "/login" }],
    });
    this.dispatchEvent(event);
  }

  toggleDarkMode(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.darkMode = checked;
    document.body.classList.toggle("dark-mode", checked);
    localStorage.setItem("dark-mode", String(checked));
  }

  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem 1rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 150%;
      max-width: 400px;
      background: var(--color-card-bg, white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    input[type="text"],
    input[type="url"] {
      padding: 0.9rem 1.2rem;
      font-size: 1.1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
    }

    select[name="album"],
    select[name="genre"] {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url('data:image/svg+xml;utf8,<svg fill="none" stroke="%23666" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6"/></svg>');
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
      cursor: pointer;
    }

    input[type="text"]:focus,
    input[type="url"]:focus,
    select[name="album"]:focus,
    select[name="genre"]:focus {
      border-color: var(--color-primary, #00449e);
      outline: none;
    }

    button {
      padding: 0.75rem;
      font-size: 1rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    button:hover {
      background-color: var(--color-primary-hover, #00307d);
    }

    .back-link {
      margin-top: 1rem;
      font-size: 0.95rem;
    }

    .back-link a {
      color: var(--color-link, #00449e);
      text-decoration: none;
    }

    .back-link a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    const albums = this.model.albums;
    const genres = this.model.genres;

    return html`
      <div class="container">
        <h2>Add New Song</h2>
        <form @submit=${this.addSong}>
          <input type="text" name="title" placeholder="Title" required />
          <input type="text" name="artist" placeholder="Artist" required />

          <select name="album">
            <option value="">Select Album (optional)</option>
            ${this.model.albums?.map(
              (a) => html`<option value=${a.name}>${a.name}</option>`
            )}
          </select>

          <select name="genre">
            <option value="">Select Genre (optional)</option>
            ${this.model.genres?.map(
              (g) => html`<option value=${g.name}>${g.name}</option>`
            )}
          </select>

          <input type="url" name="url" placeholder="Song URL (optional)" />
          <button type="submit">Add Song</button>
        </form>
        <p class="back-link"><a href="/app/songs">&#8592; Back to Songs</a></p>
      </div>
    `;
  }

  addSong(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const song = {
      title: formData.get("title")?.toString() || "",
      artist: formData.get("artist")?.toString() || "",
      album: formData.get("album")?.toString() || "",
      genre: formData.get("genre")?.toString() || "",
      url: formData.get("url")?.toString() || "",
      cover: formData.get("cover")?.toString() || "",
    };

    this.dispatchMessage([
      "songs/add",
      {
        song,
        onSuccess: () => history.back(),
      },
    ]);
  }
}

define({ "song-add": SongAddElement });
