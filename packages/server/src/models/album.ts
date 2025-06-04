import mongoose from "mongoose";

export interface Album {
  _id?: string;
  name: string;
  artist?: string;
  year?: number;
}

const AlbumSchema = new mongoose.Schema<Album>({
  name: { type: String, required: true },
  artist: String,
  year: Number,
});

export default mongoose.model("Album", AlbumSchema);
