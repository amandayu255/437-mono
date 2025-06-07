import { Song, Album, Genre } from "server/models";

export interface Model {
  songs: Song[];
  selectedSong?: Song;
  albums: Album[];
  genres: Genre[];
}

export const init: Model = {
  songs: [],
  albums: [],
  genres: [],
};