import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";

export class SongEditElement extends View<Model, Msg> {
  @property({ attribute: "song-id" }) songId = "";

  static styles = css`
    .container {
      padding: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }
    input,
    select,
    button {
      padding: 0.5rem;
      font-size: 1rem;
    }
  `;

  constructor() {
    super("musica:model");
  }

  render() {
    const song = this.model.songs.find((s) => s._id === this.songId);
    const albums = this.model.albums || [];
    const genres = this.model.genres || [];

    return html`
      <div class="container">
        <h2>Edit Song</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="title"
            .value=${song?.title || ""}
            placeholder="Song title"
            required
          />
          <input
            type="text"
            name="artist"
            .value=${song?.artist || ""}
            placeholder="Artist"
            required
          />
          <select name="album">
            ${albums.map(
              (album) => html`<option
                value=${album.name}
                ?selected=${song?.album === album.name}
              >
                ${album.name}
              </option>`
            )}
          </select>
          <select name="genre">
            ${genres.map(
              (genre) => html`<option
                value=${genre.name}
                ?selected=${song?.genre === genre.name}
              >
                ${genre.name}
              </option>`
            )}
          </select>
          <input
            type="number"
            name="year"
            .value=${song?.year || ""}
            placeholder="Year"
          />
          <input
            type="text"
            name="url"
            .value=${song?.url || ""}
            placeholder="Audio URL"
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/songs">← Back to Songs</a></p>
      </div>
    `;
  }

  save(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedSong = {
      ...this.model.songs.find((s) => s._id === this.songId),
      title: formData.get("title")?.toString() ?? "",
      artist: formData.get("artist")?.toString() ?? "",
      album: formData.get("album")?.toString() ?? "",
      genre: formData.get("genre")?.toString() ?? "",
      year: Number(formData.get("year")) || undefined,
      url: formData.get("url")?.toString() ?? "",
    };

    this.dispatchMessage([
      "songs/save",
      {
        songId: this.songId,
        song: updatedSong,
        onSuccess: () => history.back(),
      },
    ]);
  }
}

define({ "song-edit": SongEditElement });
