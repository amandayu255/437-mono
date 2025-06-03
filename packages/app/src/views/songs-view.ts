import { View } from "@calpoly/mustang";
import { html } from "lit";
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

  render() {
    return html`
      <h2>Song List</h2>
      <ul>
        ${this.songs.map(
          (song) => html`<li>${song.title} by ${song.artist}</li>`
        )}
      </ul>
    `;
  }
}