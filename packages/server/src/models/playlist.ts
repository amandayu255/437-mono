import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  albumArt: String
});

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }]
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;
