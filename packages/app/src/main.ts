import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { SongsViewElement } from "./views/songs-view";
import { HeaderElement } from "./components/blazing-header";

const routes = [
  {
    path: "/app/songs",
    view: () => html`<songs-view></songs-view>`,
  },
  {
    path: "/",
    redirect: "/app/songs",
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
  "blazing-header": HeaderElement,
});
