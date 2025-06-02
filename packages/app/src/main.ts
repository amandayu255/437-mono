import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html } from "lit";
import { HeaderElement } from "./components/blazing-header";
import "./views/home-view";
import "./views/playlist-view";

const routes = [
  {
    path: "/app/playlist/:id",
    view: (params: Switch.Params) => html`
      <playlist-view playlist-id=${params.id}></playlist-view>
    `,
  },
  {
    path: "/app",
    view: () => html` <home-view></home-view> `,
  },
  {
    path: "/",
    redirect: "/app",
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
  "blazing-header": HeaderElement,
});
