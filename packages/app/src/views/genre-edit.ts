import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";

export class GenreEditElement extends View<Model, Msg> {
  @property({ attribute: "genre-id" }) genreId = "";

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
    const genre = this.model.genres?.find((g) => g._id === this.genreId);

    return html`
      <div class="container">
        <h2>Edit Genre</h2>
        <form @submit=${this.save}>
          <input
            type="text"
            name="name"
            .value=${genre?.name || ""}
            placeholder="Genre name"
            required
          />
          <button type="submit">Save</button>
        </form>
        <p><a href="/app/genres">← Back to Genres</a></p>
      </div>
    `;
  }

  save(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const updatedGenre = {
      ...this.model.genres?.find((g) => g._id === this.genreId),
      name: formData.get("name")?.toString() ?? "",
    };

    this.dispatchMessage([
      "genre/save",
      {
        genreId: this.genreId,
        genre: updatedGenre,
        onSuccess: () => history.back(),
      },
    ]);
  }
}

define({ "genre-edit": GenreEditElement });