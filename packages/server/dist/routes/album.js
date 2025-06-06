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
var album_exports = {};
__export(album_exports, {
  default: () => album_default
});
module.exports = __toCommonJS(album_exports);
var import_express = __toESM(require("express"));
var import_album = __toESM(require("../models/album"));
var import_multer = __toESM(require("multer"));
var import_path = __toESM(require("path"));
const router = import_express.default.Router();
const storage = import_multer.default.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, Date.now() + import_path.default.extname(file.originalname));
  }
});
const upload = (0, import_multer.default)({ storage });
router.get("/", async (_req, res) => {
  const albums = await import_album.default.find();
  res.json(albums);
});
router.get("/:id", async (req, res) => {
  const album = await import_album.default.findById(req.params.id);
  if (!album) {
    res.status(404).json({ error: "Album not found" });
  } else {
    res.json(album);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await import_album.default.findByIdAndUpdate(req.params.id, req.body, {
      new: true
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
router.post("/", upload.single("cover"), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    const { name, artist, year, genre } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : "";
    const created = await import_album.default.create({
      name,
      artist,
      year: Number(year),
      genre,
      cover
    });
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating album:", err);
    res.status(500).send("Internal Server Error");
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await import_album.default.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Album not found" });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete album" });
  }
});
var album_default = router;
