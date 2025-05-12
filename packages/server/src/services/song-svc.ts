import { Schema, model } from "mongoose";
import { Song } from "../models/song";

const SongSchema = new Schema<Song>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    cover: { type: String, required: true },
    link: { type: String, required: true }
  },
  { collection: "songs" }
);

const SongModel = model<Song>("Song", SongSchema);

function index(): Promise<Song[]> {
  return SongModel.find();
}

function get(title: String): Promise<Song> {
    return SongModel.find({ title })
      .then((list) => list[0])
      .catch((err) => {
        throw `${title} Not Found`;
      });
  }

export default { index, get };