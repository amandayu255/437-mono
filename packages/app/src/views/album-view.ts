import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { Model } from "../model";
import { Msg } from "../messages";

interface Album {
  _id?: string;
  name: string;
  artist?: string;
  year?: number;
  cover?: string;
}

export class AlbumViewElement extends View<Model, Msg> {
  @state()
  albums: Album[] = [];

  @state()
  darkMode = localStorage.getItem("dark-mode") === "true";

  constructor() {
    super("musica:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadAlbums();
  }

  toggleDarkMode(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.darkMode = checked;
    document.body.classList.toggle("dark-mode", checked);
    localStorage.setItem("dark-mode", String(checked));
  }

  async loadAlbums() {
    try {
      const res = await fetch("/api/albums");
      if (!res.ok) throw new Error("Failed to load albums");
      this.albums = await res.json();
    } catch (err) {
      console.error("Error fetching albums:", err);
    }
  }

  async deleteAlbum(id: string) {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      this.loadAlbums();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  goToAddAlbum() {
    window.location.href = "/app/albums/add";
  }

  goToEditAlbum(id: string) {
    window.location.href = `/app/albums/edit/${id}`;
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
    }

    .nav-links button:hover {
      background-color: #dcedc8;
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

    .container {
      padding: 4rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    button {
      padding: 0.75rem 1.25rem;
      background-color: var(--color-primary, #00449e);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      min-width: 130px;
    }

    button:hover {
      background-color: var(--color-primary-hover, #00307d);
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

    .button-row {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .top-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .album-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .album-card {
      background: var(--color-card-bg, white);
      color: var(--color-card-text, #000);
      padding: 1rem 1.25rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      min-width: 240px;
      text-align: center;
    }

    .cover {
      width: 100%;
      max-width: 180px;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .title {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .artist {
      font-size: 0.95rem;
      color: #555;
    }
  `;
  // <button @click=${() => (window.location.href = "/app/songs")}>
  //               Songs
  //             </button>
  //             <button @click=${() => (window.location.href = "/app/genres")}>
  //               Genres
  //             </button>
  //             <button @click=${() => (window.location.href = "/app/albums")}>
  //               Albums
  //             </button>
  //             <button
  //               @click=${() => {
  //                 localStorage.removeItem("token");
  //                 const event = new CustomEvent("auth:message", {
  //                   bubbles: true,
  //                   composed: true,
  //                   detail: ["auth/signout", { redirect: "/login" }],
  //                 });
  //                 this.dispatchEvent(event);
  //               }}
  //             >
  //               Logout
  //             </button>
  render() {
    return html`
      <div class="navbar">
        <div class="navbar-wrapper">
          <strong>Welcome to Musica</strong>
          <div class="nav-links">
            <mu-link href="/app/songs">
              <button>Songs</button>
            </mu-link>
            <mu-link href="/app/genres">
              <button>Genres</button>
            </mu-link>
            <mu-link href="/app/albums">
              <button>Albums</button>
            </mu-link>
            <mu-link href="/logout">
              <button>Logout</button>
            </mu-link>

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
        <h2>Albums</h2>

        <div class="top-buttons">
          <a href="/app/albums/add"><button>Add Album</button></a>
          <button @click=${() => alert("Select an album to delete below.")}>
            Delete Album
          </button>
        </div>

        <div class="album-list">
          ${this.albums.map(
            (album) => html`
              <div class="album-card">
                <img
                  class="cover"
                  src=${album.cover || "/images/default.jpeg"}
                  alt="Cover for ${album.name}"
                />
                <div class="title">${album.name}</div>
                <div class="artist">${album.artist || "Unknown Artist"}</div>
                <div class="button-row">
                  <button
                    class="edit-btn"
                    @click=${() => this.goToEditAlbum(album._id!)}
                  >
                    Edit
                  </button>
                  <button
                    class="delete-btn"
                    @click=${() => this.deleteAlbum(album._id!)}
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

customElements.define("album-view", AlbumViewElement);
