import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "./services/mongo";
import Songs from "./services/song-svc";
import songs from "./routes/songs";

dotenv.config();
connect("musica");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/songs", songs);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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
