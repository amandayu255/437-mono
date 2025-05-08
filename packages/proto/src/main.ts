import { define } from "@calpoly/mustang";
import { MusicaLinkElement } from "./musica-link.js";
import { MusicaPlaylistElement } from "./musica-playlist.js";
import { MusicaCardElement } from "./musica-card.js";
import { MusicaViewerElement } from "./musica-viewer.js";

define({
  "musica-link": MusicaLinkElement,
  "musica-playlist": MusicaPlaylistElement,
  "musica-card": MusicaCardElement,
  "musica-viewer": MusicaViewerElement,
});
