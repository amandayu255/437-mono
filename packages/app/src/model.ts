import { Song, Playlist, Album, Genre } from "server/models";

export interface Model {
  songs: Song[];
  playlists: Playlist[];
  selectedSong?: Song;
  selectedPlaylist?: Playlist;
  albums: Album[];
  genres: Genre[];
}

export const init: Model = {
  songs: [],
  playlists: [],
  albums: [],
  genres: [],
};