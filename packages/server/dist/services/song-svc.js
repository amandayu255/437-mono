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
var song_svc_exports = {};
__export(song_svc_exports, {
  default: () => song_svc_default
});
module.exports = __toCommonJS(song_svc_exports);
var import_mongoose = require("mongoose");
var import_mongoose2 = require("mongoose");
const SongSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    cover: { type: String, required: true },
    link: { type: String, required: true }
  },
  { collection: "songs" }
);
const SongModel = (0, import_mongoose.model)("Song", SongSchema);
function index() {
  return SongModel.find();
}
function get(id) {
  return SongModel.findById(new import_mongoose2.Types.ObjectId(id)).then((result) => {
    if (!result) throw "Song not found";
    return result;
  });
}
function create(json) {
  const t = new SongModel(json);
  return t.save();
}
function update(id, song) {
  return SongModel.findByIdAndUpdate(id, song, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated;
  });
}
function remove(id) {
  return SongModel.findByIdAndDelete(id).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var song_svc_default = { index, get, create, update, remove };
