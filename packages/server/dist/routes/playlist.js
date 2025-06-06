"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var playlist_exports = {};
__export(playlist_exports, {
  default: () => playlist_default
});
module.exports = __toCommonJS(playlist_exports);
var import_express = __toESM(require("express"));
var import_playlist = __toESM(require("../models/playlist"));
var import_song = __toESM(require("../models/song"));
const router = import_express.default.Router();
router.get("/", async (req, res) => {
  try {
    const playlists = await import_playlist.default.find();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: "Failed to load playlists" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const playlist = await import_playlist.default.findById(req.params.id);
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
  async function(req, res) {
    try {
      const playlist = await import_playlist.default.findById(req.params.id);
      const { songId } = req.body;
      if (!playlist) {
        res.status(404).json({ error: "Playlist not found" });
        return;
      }
      const song = await import_song.default.findById(songId);
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
var playlist_default = router;
