import { Song } from "server/models";

export type Msg =
  | ["songs/load", {}]
  | ["songs/set", { songs: Song[] }]
  | ["song/select", { songId: string }]
  | ["playlist/select", { playlistId: string }];
