import express, { Request, Response, Router } from "express";
import Genre from "../models/genre";

const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  const genres = await Genre.find();
  res.json(genres);
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404).json({ error: "Genre not found" });
  } else {
    res.json(genre);
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ error: "Genre not found" });
    } else {
      res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update genre" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const newGenre = await Genre.create(req.body);
    res.status(201).json(newGenre);
  } catch (err) {
    res.status(400).json({ error: "Failed to create genre" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Genre.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Genre not found" });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete genre" });
  }
});

export default router;
