import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { Song } from "server/models";

export class SongsViewElement extends View<Model, Msg> {
  @state() selectedAlbum = "";
  @state() selectedGenre = "";
  @state()
  darkMode = localStorage.getItem("dark-mode") === "true";

  constructor() {
    super("musica:model");
  }

  get songs(): Song[] {
    return this.model.songs.filter(
      (s) =>
        (!this.selectedAlbum || s.album === this.selectedAlbum) &&
        (!this.selectedGenre || s.genre === this.selectedGenre)
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["songs/load", {}]);
    this.dispatchMessage(["albums/load", {}]);
    this.dispatchMessage(["genres/load", {}]);
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

  goToAddSong() {
    window.location.href = "/app/songs/add";
  }

  goToEditSong(id: string) {
    window.location.href = `/app/songs/edit/${id}`;
  }

  goToAlbums() {
    window.location.href = "/app/albums";
  }

  goToGenres() {
    window.location.href = "/app/genres";
  }

  async deleteSong(id: string) {
    if (!confirm("Are you sure you want to delete this song?")) return;
    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete song");
      this.dispatchMessage(["songs/load", {}]);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  static styles = css`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #004d40;
      color: white;
      padding: 1rem 2rem;
      z-index: 1000;
    }

    .navbar-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1450px;
      padding-left: 0;
      padding-right: 0;
    }

    .nav-links {
      display: flex;
      gap: 1.25rem;
    }

    .nav-links button {
      background-color: white;
      color: #004d40;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: bold;
      min-width: 130px;
    }

    .nav-links button:hover {
      background-color: #dcedc8;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .container {
      max-width: 800px;
      margin: 6rem auto 2rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .filter-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    select {
      padding: 0.5rem;
      font-size: 1rem;
    }

    .card {
      background: var(--color-card-bg);
      color: var(--color-card-text);
      border-radius: 12px;
      padding: 1rem;
      width: 260px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s ease;
    }

    .card:hover {
      transform: translateY(-4px);
    }

    .cover {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .info {
      text-align: center;
    }

    .title {
      font-weight: bold;
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
    }

    .artist {
      font-size: 0.95rem;
      color: #666;
    }

    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
    }

    .button-row {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: #888;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .delete-btn {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
      background-color: red;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      min-width: 70px;
    }

    .edit-btn:hover,
    .delete-btn:hover {
      background-color: #666;
    }

    #dark-mode-toggle {
      position: fixed;
      top: 1rem;
      right: 6rem;
      z-index: 2000;
      font-size: 0.9rem;
      background-color: rgba(255, 255, 255, 0.85);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      color: #222;
    }

    body.dark-mode #dark-mode-toggle {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
    }

    body.dark-mode {
      --color-card-bg: #1e1e1e;
      --color-card-text: #f1f1f1;
      --color-primary: #bb86fc;
      --color-primary-hover: #985eff;
      background-color: #121212;
      color: white;
    }

    body.dark-mode .navbar {
      background-color: #222;
    }

    body.dark-mode .nav-links button {
      background-color: #333;
      color: white;
    }

    body.dark-mode .nav-links button:hover {
      background-color: #444;
    }

    body.dark-mode button {
      background-color: var(--color-primary);
    }

    body.dark-mode button:hover {
      background-color: var(--color-primary-hover);
    }

    .toggle-container {
      margin-top: 5.5rem;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      max-width: 1200px;
      padding: 0 2rem;
    }

    .toggle-label {
      font-size: 0.95rem;
      background-color: rgba(255, 255, 255, 0.85);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
      color: #222;
    }

    body.dark-mode .toggle-label {
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
    }
  `;

  render() {
    return html`
      <div class="navbar">
        <div class="navbar-wrapper">
          <strong>Welcome to Musica</strong>
          <div class="nav-links">
            <button @click=${() => (window.location.href = "/app/songs")}>
              Songs
            </button>
            <button @click=${this.goToGenres}>Genres</button>
            <button @click=${this.goToAlbums}>Albums</button>
            <button @click=${this.logout}>Logout</button>

            <label class="toggle-label">
              <input
                type="checkbox"
                class="toggle-input"
                autocomplete="off"
                .checked=${this.darkMode}
                @change=${(e: Event) => this.toggleDarkMode(e)}
              />
              <span class="toggle-slider">Dark Mode</span>
            </label>
          </div>
        </div>
      </div>

      <div class="container">
        <h2>Song List</h2>

        <div class="filter-bar">
          <select
            @change=${(e: Event) =>
              (this.selectedAlbum = (e.target as HTMLSelectElement).value)}
          >
            <option value="">All Albums</option>
            ${this.model.albums?.map(
              (a) =>
                html`<option
                  value=${a.name}
                  ?selected=${a.name === this.selectedAlbum}
                >
                  ${a.name}
                </option>`
            )}
          </select>

          <select
            @change=${(e: Event) =>
              (this.selectedGenre = (e.target as HTMLSelectElement).value)}
          >
            <option value="">All Genres</option>
            ${this.model.genres?.map(
              (g) =>
                html`<option
                  value=${g.name}
                  ?selected=${g.name === this.selectedGenre}
                >
                  ${g.name}
                </option>`
            )}
          </select>

          <button @click=${this.goToAddSong}>Add Song</button>
        </div>

        <div class="grid">
          ${this.songs.map(
            (song) => html`
              <div class="card">
                <img
                  class="cover"
                  src=${song.cover || "/images/default.jpg"}
                  alt="Cover for ${song.title}"
                />
                <div class="info">
                  <div class="title">${song.title}</div>
                  <div class="artist">${song.artist}</div>
                </div>
                <div class="button-row">
                  <button
                    class="edit-btn"
                    @click=${() => this.goToEditSong(song._id!)}
                  >
                    Edit
                  </button>
                  <button
                    class="delete-btn"
                    @click=${() => this.deleteSong(song._id!)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define("songs-view", SongsViewElement);
