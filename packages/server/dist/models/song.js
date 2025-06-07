"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var song_exports = {};
__export(song_exports, {
  default: () => song_default
});
module.exports = __toCommonJS(song_exports);
var import_mongoose = require("mongoose");
const SongSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: false },
    cover: { type: String, required: false },
    link: { type: String, required: false }
  },
  { collection: "songs" }
);
const SongModel = import_mongoose.models.Song || (0, import_mongoose.model)("Song", SongSchema);
var song_default = SongModel;
