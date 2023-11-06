const express = require("express");
const cors = require('cors');
const request = require('request');
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());

app.use('/pdf', (req, res) => {
    const googleDriveLink = 'https://drive.google.com/file/d/1oWm--awbX0cYscaG99fFKwHwrzV7vwfs/view';
  
    // Extract the file ID from the Google Drive link
    const fileId = googleDriveLink.match(/\/d\/(.+?)\//);
    if (fileId && fileId[1]) {
      const directDownloadLink = `https://drive.google.com/uc?id=${fileId[1]}`;
      
      // Set the response headers to indicate a PDF file
      res.setHeader('Content-Type', 'application/pdf');
      
      // Pipe the direct download link to the response
      request(directDownloadLink).pipe(res);
    } else {
      res.status(500).send('Invalid Google Drive link');
    }
  });



app.use('/api',require('./routes/admin'))

const PORT = process.env.PORT
app.listen(PORT,
    ()=>{
          console.log(`starting http://localhost:${PORT}`);
    }
)

