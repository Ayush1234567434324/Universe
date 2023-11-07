const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());


const request = require('request');

app.get('/pdf/:id', (req, res) => {
  // Get the 'id' parameter from the request URL
  const id = req.params.id;

  // Create the Google Drive link with the provided 'id'
  const googleDriveLink = `https://drive.google.com/file/d/${id}/view`;

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

