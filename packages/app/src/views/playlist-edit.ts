import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { define, Form, View, History } from "@calpoly/mustang";
import { Model } from "../model";
import { Msg } from "../messages";
import { Playlist } from "server/models";

export class PlaylistEditElement extends View<Model, Msg> {
  static uses = define({ "mu-form": Form.Element });

  @property({ attribute: "playlist-id" }) playlistId = "";

  @state()
  get playlist(): Playlist | undefined {
    return this.model.selectedPlaylist;
  }

  constructor() {
    super("musica:model");
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.playlistId) {
      this.dispatchMessage([
        "playlist/select",
        { playlistId: this.playlistId },
      ]);
    }
  }

  render() {
    return html`
      <h2>Edit Playlist</h2>
      ${this.playlist
        ? html`<mu-form
            .init=${this.playlist}
            @mu-form:submit=${this.handleSubmit}
          >
            <label>
              Name:
              <input name="name" .value=${this.playlist.name} required />
            </label>
            <label>
              Description:
              <input
                name="description"
                .value=${this.playlist.description ?? ""}
              />
            </label>
            <button type="submit">Save</button>
          </mu-form>`
        : html`<p>Loading...</p>`}
    `;
  }

  handleSubmit(event: Form.SubmitEvent<Playlist>) {
    this.dispatchMessage([
      "playlist/save",
      {
        playlistId: this.playlistId,
        playlist: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/playlist/${this.playlistId}`,
          }),
        onFailure: (err: Error) => console.error("Save failed:", err),
      },
    ]);
  }
}

define({ "playlist-edit": PlaylistEditElement });
