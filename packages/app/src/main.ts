import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { HeaderElement } from "./components/blazing-header";
import "./views/login-view";
import "./views/register-view";
import "./views/song-add";
import "./views/song-edit";
import "./views/songs-view";
import "./views/playlist-view";
import "./views/playlist-edit";
import "./views/album-view";
import "./views/album-add";
import "./views/album-edit";
import "./views/genre-view";
import "./views/genre-add";
import "./views/genre-edit";
import "./views/home-view";

const routes = [
  { path: "/app/songs", view: () => html`<songs-view></songs-view>` },
  { path: "/app/songs/add", view: () => html`<song-add></song-add>` },
  { path: "/app/songs/:songId/edit", view: (params: any) => html`<song-edit song-id=${params.songId}></song-edit>` },

  { path: "/app/genres", view: () => html`<genre-view></genre-view>` },
  { path: "/app/genres/add", view: () => html`<genre-add></genre-add>` },
  { path: "/app/genre/:genreId/edit", view: (params: any) => html`<genre-edit genre-id=${params.genreId}></genre-edit>` },

  { path: "/app/albums", view: () => html`<album-view></album-view>` },
  { path: "/app/albums/add", view: () => html`<album-add></album-add>` },
  { path: "/app/album/:albumId/edit", view: (params: any) => html`<album-edit album-id=${params.albumId}></album-edit>` },

  { path: "/app/playlists", view: () => html`<playlist-view></playlist-view>` },
  { path: "/app/playlist/:playlistId", view: (params: any) => html`<playlist-view playlist-id=${params.playlistId}></playlist-view>` },
  { path: "/app/playlist/:playlistId/edit", view: (params: any) => html`<playlist-edit playlist-id=${params.playlistId}></playlist-edit>` },

  { path: "/login", view: () => html`<login-view></login-view>` },
  { path: "/register", view: () => html`<register-view></register-view>` },

  { path: "/", redirect: "/app/songs" },

  { path: "*", redirect: "/app/songs" }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "musica:history", "musica:auth");
    }
  },
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "musica:auth");
    }
  },

  "blazing-header": HeaderElement
});
