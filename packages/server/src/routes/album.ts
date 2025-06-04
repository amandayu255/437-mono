import express, { Request, Response, Router } from "express";
import Album from "../models/album";
import multer from "multer";
import path from "path";

const router: Router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all albums
router.get("/", async (_req: Request, res: Response) => {
  const albums = await Album.find();
  res.json(albums);
});

// GET album by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const album = await Album.findById(req.params.id);
  if (!album) {
    res.status(404).json({ error: "Album not found" });
  } else {
    res.json(album);
  }
});

// PUT update album
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ error: "Album not found" });
    } else {
      res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update album" });
  }
});

// POST create album (with optional file upload)
router.post("/", upload.single("cover"), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const { name, artist, year, genre } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : "";

    const created = await Album.create({
      name,
      artist,
      year: Number(year),
      genre,
      cover,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating album:", err);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE album
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Album.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Album not found" });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete album" });
  }
});

export default router;
