const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
 Username :{
           
  
 },
 Name : {

 },
 email :{

 },
 

});



const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
