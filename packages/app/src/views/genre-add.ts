import { html, css } from "lit";
import { define, View } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";

export class GenreAddElement extends View<Model, Msg> {
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
  `;

  render() {
    return html`
      <div class="container">
        <h2>Add Genre</h2>
        <form @submit=${this.save}>
          <input name="name" placeholder="Genre Name" required />
          <button type="submit">Add</button>
        </form>
        <p class="back-link"><a href="/app/genres">&#8592; Back to Genres</a></p>
      </div>
    `;
  }

  save(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as any;

    fetch("/api/genres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add genre");
        history.back();
      })
      .catch(console.error);
  }
}

define({ "genre-add": GenreAddElement });