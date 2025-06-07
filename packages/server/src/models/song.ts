import mongoose, { Schema, model, models } from "mongoose";

export interface Song {
  title: string;
  artist: string;
  album: string;
  cover: string;
  link: string;
}

const SongSchema = new Schema<Song>(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: false },
    cover: { type: String, required: false },
    link: { type: String, required: false }
  },
  { collection: "songs" }
);

const SongModel = models.Song || model<Song>("Song", SongSchema);
export default SongModel;