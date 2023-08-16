import express from "express"
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();
app.get("/test", async (req, res) => {
    try {
      // Create a new user
      const newUser = new UserModel({
        name: "Test User",
        friends: [{ username: "Friend 1" }, { username: "Friend 2" }],
        chats: [
          {
            friend: "replace_with_valid_friend_id", // Replace with a valid friend's User ID
            received: [{ content: "Hello!" }],
            sent: [{ content: "Hi there!" }],
          },
        ],
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Find the user and populate their friends and chats
      const user = await UserModel.findOne({ name: "Test User" })
        .populate("chats.friend")
        .exec();
  
      return res.json(user);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "An error occurred." });
    }
  });

app.use("/",(req,res)=>
{
    res.json({message:"hello world"});
});
const PORT = process.env.PORT
app.listen(PORT,
    ()=>{
          console.log('starting');
    }
)