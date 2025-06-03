export interface Song {
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genre?: string;
  url?: string;
  _id?: string;
}

export interface Playlist {
  name: string;
  description?: string;
  songIds: string[];
  _id?: string;
}

