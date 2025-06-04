import { Song, Playlist } from "server/models";

export type Msg =
  | ["songs/load", {}]
  | ["songs/set", { songs: Song[] }]
  | ["song/select", { songId: string }]
  | ["playlist/select", { playlistId: string }]
  | [
      "playlist/save",
      {
        playlistId: string;
        playlist: Playlist;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];