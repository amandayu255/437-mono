import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Playlist, Song } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "songs/load":
      loadSongs(user).then((songs) => apply((model) => ({ ...model, songs })));
      break;

    case "songs/set":
      apply((model) => ({ ...model, songs: message[1].songs }));
      break;

    case "song/select": {
      const { songId } = message[1];
      apply((model) => {
        const selected = model.songs.find((s) => s._id === songId);
        return { ...model, selectedSong: selected };
      });
      break;
    }

    case "playlist/select": {
      const { playlistId } = message[1];
      loadPlaylist(playlistId, user).then((playlist) =>
        apply((model) => ({ ...model, selectedPlaylist: playlist }))
      );
      break;
    }

    case "playlist/save": {
      savePlaylist(message[1], user)
        .then((playlist) =>
          apply((model) => ({ ...model, selectedPlaylist: playlist }))
        )
        .then(() => message[1].onSuccess?.())
        .catch((err: Error) => message[1].onFailure?.(err));
      break;
    }

    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled message: ${unhandled}`);
  }
}

function loadSongs(user: Auth.User) {
  const headers = Auth.headers(user);
  console.log("Auth headers:", headers);

  return fetch("/api/songs", {
    headers,
  })
    .then((res) => {
      if (res.status === 403) throw new Error("Forbidden - check token");
      return res.ok ? res.json() : [];
    })
    .then((json) => json as Song[]);
}

function loadPlaylist(playlistId: string, user: Auth.User) {
  return fetch(`/api/playlists/${playlistId}`, {
    headers: Auth.headers(user),
  })
    .then((res) => (res.ok ? res.json() : undefined))
    .then((json) => json as Playlist);
}

function savePlaylist(
  msg: { playlistId: string; playlist: Playlist },
  user: Auth.User
) {
  return fetch(`/api/playlists/${msg.playlistId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.playlist),
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      throw new Error(`Failed to save playlist for ${msg.playlistId}`);
    })
    .then((json) => json as Playlist);
}
