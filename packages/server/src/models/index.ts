export interface Song {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
  url?: string;
  cover?: string;
  _id?: string;
}

export type { Album } from "./album";
export type { Genre } from "./genre";