import express, { Request, Response } from "express";
import Playlist from "../models/playlist";
import Song from "../models/song";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const playlists = await Playlist.find();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: "Failed to load playlists" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
    } else {
      res.json(playlist);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/:id/songs",
  async function (req: Request, res: Response): Promise<void> {
    try {
      const playlist = await Playlist.findById(req.params.id);
      const { songId } = req.body;

      if (!playlist) {
        res.status(404).json({ error: "Playlist not found" });
        return;
      }

      const song = await Song.findById(songId);
      if (!song) {
        res.status(404).json({ error: "Song not found" });
        return;
      }

      if (!playlist.songIds.includes(song._id)) {
        playlist.songIds.push(song._id);
        await playlist.save();
      }

      res.status(200).json(playlist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add song to playlist" });
    }
  }
);

export default router;
