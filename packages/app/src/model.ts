import { Song, Playlist } from "server/models";

export interface Model {
  songs: Song[];
  selectedSong?: Song;
  selectedPlaylist?: Playlist;
}

export const init: Model = {
  songs: [],
};