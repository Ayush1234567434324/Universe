const express = require("express");
const cors = require('cors');

const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/'); // Set the allowed origin(s)
    // Other CORS headers may also be necessary
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  



app.use('/api',require('./routes/admin'))

const PORT = process.env.PORT
app.listen(PORT,
    ()=>{
          console.log(`starting http://localhost:${PORT}`);
    }
)