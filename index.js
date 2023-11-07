const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());



  
 
  
  
app.use('/api',require('./routes/admin'))
app.use('/manga',require('./routes/chapter'))
const PORT = process.env.PORT
app.listen(PORT,
    ()=>{
          console.log(`starting http://localhost:${PORT}`);
    }
)

