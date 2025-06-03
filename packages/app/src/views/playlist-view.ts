import { html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { define, View } from "@calpoly/mustang";

import { Msg } from "../messages";
import { Model } from "../model";
import { Song } from "server/models";

export class PlaylistViewElement extends View<Model, Msg> {
  @property({ attribute: "playlist-id" }) playlistId = "";

  @state()
  get songs(): Song[] {
    return this.model.selectedPlaylist?.songIds
      ?.map((id) => this.model.songs.find((s) => s._id === id))
      .filter((s): s is Song => !!s) ?? [];
  }

  static styles = css`
    .container {
      padding: 1rem;
    }

    .song {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .song img {
      width: 64px;
      height: 64px;
      object-fit: cover;
    }

    .song-details {
      display: flex;
      flex-direction: column;
    }
  `;

  constructor() {
    super("musica:model");
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === "playlist-id" && oldVal !== newVal && newVal) {
      this.dispatchMessage(["playlist/select", { playlistId: newVal }]);
    }
  }

  render() {
    return html`
      <div class="container">
        <h2>Playlist: ${this.model.selectedPlaylist?.name ?? this.playlistId}</h2>
        ${this.songs.map(
          (song) => html`
            <div class="song">
              <img src=${song.url ?? ""} />
              <div class="song-details">
                <strong>${song.title}</strong>
                <span>${song.artist}</span>
              </div>
            </div>
          `
        )}
        <p><a href="/app">← Back</a></p>
      </div>
    `;
  }
}

define({ "playlist-view": PlaylistViewElement });
