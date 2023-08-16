import express from "express"
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();


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