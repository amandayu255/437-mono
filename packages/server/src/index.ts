import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "./services/mongo";
import Songs from "./services/song-svc";
import songs from "./routes/songs";
import auth, { authenticateUser } from "./routes/auth";
import path from "path";
import fs from "node:fs/promises";
import albumRoutes from "./routes/album";
import playlistRoutes from "./routes/playlist";
import genreRoutes from "./routes/genre";

dotenv.config();
connect("musica");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = path.resolve(__dirname, "../../app/dist");

app.use(express.json());

app.use("/auth", auth);
app.use("/api/songs", songs);
app.use("/api/albums", albumRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/genres", genreRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/app", express.static(staticDir));

app.get("/app/*", async (_req, res) => {
  try {
    const indexHtml = await fs.readFile(path.join(staticDir, "index.html"), "utf8");
    res.send(indexHtml);
  } catch (err) {
    res.status(500).send("Error loading frontend.");
  }
});

app.get("/login", (_, res) => {
  res.sendFile(path.join(staticDir, "login.html"));
});

app.get("/songs", async (_req: Request, res: Response) => {
  try {
    const allSongs = await Songs.index();
    res.json(allSongs);
  } catch (error) {
    res.status(500).send("Error retrieving songs.");
  }
});

app.get("/songs/:title", async (req: Request, res: Response) => {
  try {
    const song = await Songs.get(req.params.title);
    if (song) {
      res.json(song);
    } else {
      res.status(404).send("Song not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving song.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});