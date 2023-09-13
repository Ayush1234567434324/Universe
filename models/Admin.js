const mongoose = require("mongoose");

const mangaSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    artist: {
      type: String,
      required: true
    },
    artwork: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      unique: true
    },
    id: {
      type: String,
      required: true,
      unique: true
    },
    likes: {
      type: [String],
      default: []
    },
    adds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    }
  }
 

);



const UserModel = mongoose.model("Manga", mangaSchema);

module.exports = UserModel;
