import express from "express";
import Playlist from "../models/playlist";

const router = express.Router();

// GET /api/playlists/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await Playlist.findOne({ id });
    if (playlist) {
      res.json({ songs: playlist.songs });
    } else {
      res.status(404).json({ error: "Playlist not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
