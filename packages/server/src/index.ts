import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "./services/mongo";
import Songs from "./services/song-svc";
import songs from "./routes/songs";
import auth, { authenticateUser } from "./routes/auth";
import path from "path";
// import fs from "node:fs/promises";
import { readFile } from "node:fs/promises";
import albumRoutes from "./routes/album";
import genreRoutes from "./routes/genre";

dotenv.config();
connect("musica");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
// const staticDir = path.resolve(__dirname, "../../app/dist");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/songs", songs);
app.use("/api/albums", albumRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/genres", genreRoutes);
app.use("/auth", auth);

app.use(express.static(staticDir));
app.use(express.static("dist"));

app.get("/login", (_, res) => {
  res.sendFile(path.join(staticDir, "login.html"));
});

app.get("/songs", async (req: Request, res: Response) => {
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

// app.use("/app", async (_req, res) => {
//   const indexHtml = path.resolve(staticDir, "index.html");
//   const html = await fs.readFile(indexHtml, "utf8");
//   res.send(html);
// });
app.use(async (_req, res) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  try {
    const html = await readFile(indexHtml, "utf8");
    res.status(200).send(html);
  } catch (err) {
    console.error("Failed to read index.html:", err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});