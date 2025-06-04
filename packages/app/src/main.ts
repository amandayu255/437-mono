import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import "./views/login-view";
import "./views/register-view";
import { SongsViewElement } from "./views/songs-view";
import { HeaderElement } from "./components/blazing-header";
import { PlaylistViewElement } from "./views/playlist-view";
import { PlaylistEditElement } from "./views/playlist-edit";

const routes = [
  {
    path: "/app/songs",
    view: () => html`<songs-view></songs-view>`,
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
});
