import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import "./views/login-view";
import "./views/register-view";
import "./views/song-add";
import { SongsViewElement } from "./views/songs-view";
import { HeaderElement } from "./components/blazing-header";
import { PlaylistViewElement } from "./views/playlist-view";
import { PlaylistEditElement } from "./views/playlist-edit";
import { AlbumViewElement } from "./views/album-view";
import { AlbumAddElement } from "./views/album-add";
import { GenreViewElement } from "./views/genre-view";
import { GenreAddElement } from "./views/genre-add";

const routes = [
  {
    path: "/app/songs",
    view: () => html`<songs-view></songs-view>`,
  },
  {
    path: "/app/songs/add",
    view: () => html`<song-add></song-add>`,
  },  
  {
    path: "/app/playlist/:playlistId",
    view: (params: any) =>
      html`<playlist-view playlist-id=${params.playlistId}></playlist-view>`,
  },
  {
    path: "/app/playlist/:playlistId/edit",
    view: (params: any) =>
      html`<playlist-edit playlist-id=${params.playlistId}></playlist-edit>`,
  },
  {
    path: "/app/genres",
    view: () => html`<genre-view></genre-view>`,
  },
  {
    path: "/app/genres/add",
    view: () => html`<genre-add></genre-add>`,
  },
  {
    path: "/app/genre/:genreId/edit",
    view: (params: any) =>
      html`<genre-edit genre-id=${params.genreId}></genre-edit>`,
  },
  {
    path: "/app/albums",
    view: () => html`<album-view></album-view>`,
  },
  {
    path: "/app/albums/add",
    view: () => html`<album-add></album-add>`,
  },
  {
    path: "/app/album/:albumId/edit",
    view: (params: any) =>
      html`<album-edit album-id=${params.albumId}></album-edit>`,
  },
  {
    path: "/app/playlists",
    view: () => html`<playlist-view></playlist-view>`,
  },
  {
    path: "/",
    redirect: "/app/songs",
  },
  {
    path: "/login",
    view: () => html`<login-view></login-view>`,
  },
  {
    path: "/register",
    view: () => html`<register-view></register-view>`,
  },
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
  "songs-view": SongsViewElement,
  "playlist-view": PlaylistViewElement,
  "playlist-edit": PlaylistEditElement,
  "blazing-header": HeaderElement,
  "album-view": AlbumViewElement,
  "album-add": AlbumAddElement,
  "genre-view": GenreViewElement,
  "genre-add": GenreAddElement,
});
