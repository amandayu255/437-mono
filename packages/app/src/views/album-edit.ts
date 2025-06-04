import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";

export class AlbumEditElement extends View<Model, Msg> {
  @property({ attribute: "album-id" }) albumId = "";

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
    button {
      padding: 0.5rem;
      font-size: 1rem;
    }
  `;

  constructor() {
    super("musica:model");
  }

  render() {
    const album = this.model.albums?.find((a) => a._id === this.albumId);

    return html`
      <div class="container">
        <h2>Edit Album</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="name"
            .value=${album?.name || ""}
            placeholder="Album name"
            required
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/albums">← Back to Albums</a></p>
      </div>
    `;
  }

  save(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedAlbum = {
      ...this.model.albums?.find((a) => a._id === this.albumId),
      name: formData.get("name")?.toString() ?? "",
    };

    this.dispatchMessage([
      "album/save",
      {
        albumId: this.albumId,
        album: updatedAlbum,
        onSuccess: () => history.back(),
      },
    ]);
  }
}

define({ "album-edit": AlbumEditElement });