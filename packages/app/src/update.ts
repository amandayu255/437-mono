import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Song, Album, Genre } from "server/models";

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

    case "songs/add": {
      saveNewSong(message[1], user)
        .then((song) =>
          apply((model) => ({
            ...model,
            songs: [...model.songs, song],
          }))
        )
        .then(() => message[1].onSuccess?.())
        .catch((err: Error) => message[1].onFailure?.(err));
      break;
    }

    case "songs/save": {
      saveSong(message[1], user)
        .then((song) =>
          apply((model) => ({
            ...model,
            songs: model.songs.map((s) => (s._id === song._id ? song : s)),
          }))
        )
        .then(() => message[1].onSuccess?.())
        .catch((err: Error) => message[1].onFailure?.(err));
      break;
    }

    case "genre/save": {
      saveGenre(message[1], user)
        .then((genre) =>
          apply((model) => ({
            ...model,
            genres: model.genres.map((g) => (g._id === genre._id ? genre : g)),
          }))
        )
        .then(() => message[1].onSuccess?.())
        .catch((err: Error) => message[1].onFailure?.(err));
      break;
    }

    case "albums/load":
      fetch("/api/albums", { headers: Auth.headers(user) })
        .then((res) => res.json())
        .then((albums) => apply((model) => ({ ...model, albums })));
      break;

    case "genres/load":
      fetch("/api/genres", { headers: Auth.headers(user) })
        .then((res) => res.json())
        .then((genres) => apply((model) => ({ ...model, genres })));
      break;

    case "album/save": {
      saveAlbum(message[1], user)
        .then((album) =>
          apply((model) => ({
            ...model,
            albums: model.albums.map((a) => (a._id === album._id ? album : a)),
          }))
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

function saveNewSong(msg: { song: Song }, user: Auth.User): Promise<Song> {
  return fetch("/api/songs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.song),
  })
    .then((res) => {
      if (res.status === 201) return res.json();
      throw new Error("Failed to create new song");
    })
    .then((json) => json as Song);
}

function saveSong(msg: { songId: string; song: Song }, user: Auth.User) {
  return fetch(`/api/songs/${msg.songId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.song),
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      throw new Error(`Failed to save song for ${msg.songId}`);
    })
    .then((json) => json as Song);
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

function saveGenre(msg: { genreId: string; genre: Genre }, user: Auth.User) {
  return fetch(`/api/genres/${msg.genreId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.genre),
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      throw new Error(`Failed to save genre for ${msg.genreId}`);
    })
    .then((json) => json as Genre);
}

function saveAlbum(msg: { albumId: string; album: Album }, user: Auth.User) {
  return fetch(`/api/albums/${msg.albumId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.album),
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      throw new Error(`Failed to save album for ${msg.albumId}`);
    })
    .then((json) => json as Album);
}
