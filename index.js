const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());


const request = require('request');



app.use('/pdf/:id', (req, res) => {
  const id = req.params.id;
  const googleDriveLink = `https://drive.google.com/file/d/${id}/view`;
  const fileId = googleDriveLink.match(/\/d\/(.+?)\//);

  if (fileId && fileId[1]) {
    const directDownloadLink = `https://drive.google.com/uc?id=${fileId[1]}`;

    // Set the response headers to indicate a PDF file
    res.setHeader('Content-Type', 'application/pdf');

    // Use the request library to make a request to the direct download link
    const pdfRequest = request(directDownloadLink);

    // Handle errors
    pdfRequest.on('error', (err) => {
      console.error('Error fetching PDF:', err);
      res.status(500).send('Error fetching PDF');
    });

    // Pipe the PDF stream to the response in chunks
    pdfRequest.pipe(res);
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

