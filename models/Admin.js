const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const mangaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  status: {
    type: String,
  },
  genre: {
    type: [String],
    default: []
  },
  artwork: {
    type: String,
    required: true
  },
  url: {
    type: [{
      key: String,
      description: String,
      chat: [chatSchema], // Embedding chatSchema in the url array
    }],
    default: []
  },
  page: {
    type: {
      pagefront: String,
      pageback: String
    }
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: [String],
    default: []
  },
  adds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
});

const MangaModel = mongoose.model("Manga", mangaSchema);

module.exports = MangaModel;
