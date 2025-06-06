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
var genre_exports = {};
__export(genre_exports, {
  default: () => genre_default
});
module.exports = __toCommonJS(genre_exports);
var import_express = __toESM(require("express"));
var import_genre = __toESM(require("../models/genre"));
const router = import_express.default.Router();
router.get("/", async (_req, res) => {
  const genres = await import_genre.default.find();
  res.json(genres);
});
router.get("/:id", async (req, res) => {
  const genre = await import_genre.default.findById(req.params.id);
  if (!genre) {
    res.status(404).json({ error: "Genre not found" });
  } else {
    res.json(genre);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await import_genre.default.findByIdAndUpdate(req.params.id, req.body, {
      new: true
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
router.post("/", async (req, res) => {
  try {
    const newGenre = await import_genre.default.create(req.body);
    res.status(201).json(newGenre);
  } catch (err) {
    res.status(400).json({ error: "Failed to create genre" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await import_genre.default.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Genre not found" });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete genre" });
  }
});
var genre_default = router;
