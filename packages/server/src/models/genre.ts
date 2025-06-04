import mongoose from "mongoose";

export interface Genre {
  _id?: string;
  name: string;
}

const GenreSchema = new mongoose.Schema<Genre>({
  name: { type: String, required: true },
});

export default mongoose.model("Genre", GenreSchema);
