import { html, css } from "lit";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";

export class AlbumAddElement extends View<Model, Msg> {
  constructor() {
    super("musica:model");
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
      width: 100%;
      max-width: 400px;
      background: var(--color-card-bg, white);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    input {
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background: white;
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

    a.hidden-link {
      display: none;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h2>Add Album</h2>
        <form @submit=${this.save}>
          <input name="name" placeholder="Album Name" required />
          <input name="artist" placeholder="Artist" required />
          <input name="year" type="number" placeholder="Year" required />
          <input name="genre" placeholder="Genre (optional)" />
          <input name="cover" type="file" accept="image/*" />
          <button type="submit">Add</button>
        </form>

        <!-- Hidden redirect link -->
        <a id="redirectLink" href="/app/albums" class="hidden-link">Go to Albums</a>

        <p class="back-link">
          <a href="/app/albums">&#8592; Back to Albums</a>
        </p>
      </div>
    `;
  }

  save(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    fetch("/api/albums", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add album");

        const link = this.renderRoot.querySelector(
          "#redirectLink"
        ) as HTMLAnchorElement;
        if (link) link.click();
      })
      .catch(console.error);
  }
}

define({ "album-add": AlbumAddElement });
