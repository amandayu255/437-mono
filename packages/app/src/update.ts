import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Song, Playlist } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "songs/load":
      loadSongs(user).then((songs) =>
        apply((model) => ({ ...model, songs }))
      );
      break;

    case "song/select":
      const { songId } = message[1];
      apply((model) => {
        const selected = model.songs.find((s) => s._id === songId);
        return { ...model, selectedSong: selected };
      });
      break;

    case "playlist/select":
      const { playlistId } = message[1];
      loadPlaylist(playlistId, user).then((playlist) =>
        apply((model) => ({ ...model, selectedPlaylist: playlist }))
      );
      break;

    default:
      throw new Error(`Unhandled message: ${message[0]}`);
  }
}

function loadSongs(user: Auth.User) {
  return fetch("/api/songs", {
    headers: Auth.headers(user),
  })
    .then((res) => (res.ok ? res.json() : []))
    .then((json) => json as Song[]);
}

function loadPlaylist(playlistId: string, user: Auth.User) {
  return fetch(`/api/playlists/${playlistId}`, {
    headers: Auth.headers(user),
  })
    .then((res) => (res.ok ? res.json() : undefined))
    .then((json) => json as Playlist);
}
