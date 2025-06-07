import { Song, Album, Genre } from "server/models";

export type Msg =
  | ["songs/load", {}]
  | ["albums/load", {}]
  | ["genres/load", {}]
  | ["songs/set", { songs: Song[] }]
  | ["song/select", { songId: string }]
  | [
      "songs/save",
      {
        songId: string;
        song: Song;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "songs/add",
      {
        song: Song;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "album/save",
      {
        albumId: string;
        album: Album;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "genre/save",
      {
        genreId: string;
        genre: Genre;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];
