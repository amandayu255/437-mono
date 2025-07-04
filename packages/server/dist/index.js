"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_dotenv = __toESM(require("dotenv"));
var import_mongo = require("./services/mongo");
var import_song_svc = __toESM(require("./services/song-svc"));
var import_songs = __toESM(require("./routes/songs"));
var import_auth = __toESM(require("./routes/auth"));
var import_path = __toESM(require("path"));
var import_promises = require("node:fs/promises");
var import_album = __toESM(require("./routes/album"));
var import_genre = __toESM(require("./routes/genre"));
import_dotenv.default.config();
(0, import_mongo.connect)("musica");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use("/api/songs", import_songs.default);
app.use("/api/albums", import_album.default);
app.use("/uploads", import_express.default.static("uploads"));
app.use("/api/genres", import_genre.default);
app.use("/auth", import_auth.default);
app.use(import_express.default.static(staticDir));
app.use(import_express.default.static("dist"));
app.get("/login", (_, res) => {
  res.sendFile(import_path.default.join(staticDir, "login.html"));
});
app.get("/songs", async (req, res) => {
  try {
    const allSongs = await import_song_svc.default.index();
    res.json(allSongs);
  } catch (error) {
    res.status(500).send("Error retrieving songs.");
  }
});
app.get("/songs/:title", async (req, res) => {
  try {
    const song = await import_song_svc.default.get(req.params.title);
    if (song) {
      res.json(song);
    } else {
      res.status(404).send("Song not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving song.");
  }
});
app.use(async (_req, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  try {
    const html = await (0, import_promises.readFile)(indexHtml, "utf8");
    res.status(200).send(html);
  } catch (err) {
    console.error("Failed to read index.html:", err);
    res.status(500).send("Server error");
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
