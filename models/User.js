const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const FriendSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  // You can add other friend-related fields here
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  friends: {
    type: [FriendSchema],
    default: [],
  },
  chats: [
    {
      friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
      received: [MessageSchema],
      sent: [MessageSchema],
    },
  ],
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
