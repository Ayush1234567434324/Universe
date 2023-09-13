const express = require("express");
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use('api',require('./routes/admin'))
const PORT = process.env.PORT
app.listen(PORT,
    ()=>{
          console.log('starting');
    }
)