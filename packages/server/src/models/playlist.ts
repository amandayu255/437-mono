import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  albumArt: String,
});

const PlaylistSchema = new mongoose.Schema({
  id: String,
  name: String,
  songs: [SongSchema],
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;
