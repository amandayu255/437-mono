import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { Song } from "server/models";

export class SongsViewElement extends View<Model, Msg> {
  @state()
  get songs(): Song[] {
    return this.model.songs;
  }

  constructor() {
    super("musica:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["songs/load", {}]);
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

  static styles = css`
    .top-right {
      position: absolute;
      top: 3rem; /* pushes below the Dark Mode toggle */
      right: 1rem;
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

    h2 {
      padding-left: 1rem;
    }

    ul {
      padding-left: 2rem;
    }
  `;

  render() {
    return html`
      <div class="top-right">
        <button @click=${this.logout}>Logout</button>
      </div>
      <h2>Song List</h2>
      <ul>
        ${(this.songs ?? []).map(
          (song) => html`<li>${song.title} by ${song.artist}</li>`
        )}
      </ul>
    `;
  }
}
