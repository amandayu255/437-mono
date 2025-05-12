import { Schema, model } from "mongoose";
import { Song } from "../models/song";
import { Types } from "mongoose";

const SongSchema = new Schema<Song>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    cover: { type: String, required: true },
    link: { type: String, required: true },
  },
  { collection: "songs" }
);

const SongModel = model<Song>("Song", SongSchema);

function index(): Promise<Song[]> {
  return SongModel.find();
}

function get(id: string): Promise<Song | null> {
  return SongModel.findById(new Types.ObjectId(id)).then((result) => {
    if (!result) throw "Song not found";
    return result;
  });
}

function create(json: Song): Promise<Song> {
  const t = new SongModel(json);
  return t.save();
}

function update(id: string, song: Song): Promise<Song> {
  return SongModel.findByIdAndUpdate(id, song, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated as Song;
  });
}

function remove(id: string): Promise<void> {
  return SongModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
