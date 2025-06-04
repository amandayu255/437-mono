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
    album: { type: String, required: true },
    cover: { type: String, required: true },
    link: { type: String, required: true }
  },
  { collection: "songs" }
);

const SongModel = models.Song || model<Song>("Song", SongSchema);
export default SongModel;