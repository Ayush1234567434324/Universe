const mongoose = require('mongoose');

const usernameSchema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  
  },
  phone: {
    type: String
  },
  country: {
    type: String
  },
  avatar:
  {
    type:String
  },
  Reading: {
    type: [String],
    default: []
  },
  Completed: {
    type: [String],
    default: []
  },
  otp:
  {
    type:String
  }
});

const Username = mongoose.model('Username', usernameSchema);

module.exports = Username;
