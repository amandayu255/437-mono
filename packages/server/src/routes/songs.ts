import express, { Request, Response } from "express";
import Songs from "../services/song-svc";
import { Song } from "../models/song";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Songs.index()
    .then((list: Song[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req, res) => {
  Songs.get(req.params.id)
    .then((song) =>
      song ? res.json(song) : res.status(404).send("Song not found")
    )
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newSong = req.body;

  Songs.create(newSong)
    .then((song: Song) => res.status(201).json(song))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req, res) => {
  Songs.update(req.params.id, req.body)
    .then((song) =>
      song ? res.json(song) : res.status(404).send("Song not found")
    )
    .catch((err) => res.status(500).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Songs.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
