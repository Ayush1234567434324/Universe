const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());

const axios = require('axios');
const { PDFDocument } = require('pdf-lib');
const rangeParser = require('range-parser');
const { pipeline } = require('stream');

app.get('/pdf/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    // Download the PDF file from Google Drive
    const response = await axios({
      method: 'GET',
      url: `https://drive.google.com/uc?export=download&id=${fileId}`,
      responseType: 'arraybuffer', // Make sure to request the file as an array buffer
    });

    // Create a PDF document from the downloaded buffer
    const pdfDoc = await PDFDocument.load(response.data);

    // Convert the PDF document to a buffer
    const pdfBuffer = await pdfDoc.save();

    // Set headers for the response
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', 'application/pdf');

    // Check the file size
    const fileSize = pdfBuffer.length;

    // If the file size exceeds 4 MB, split it into chunks
    if (fileSize > 4 * 1024 * 1024) {
      const chunks = Math.ceil(fileSize / (4 * 1024 * 1024));
      res.setHeader('Content-Range', `bytes 0-${fileSize - 1}/${fileSize}`);
      res.status(206); // Partial Content

      for (let i = 0; i < chunks; i++) {
        const start = i * (4 * 1024 * 1024);
        const end = Math.min((i + 1) * (4 * 1024 * 1024) - 1, fileSize - 1);

        // Send each chunk
        res.write(pdfBuffer.slice(start, end + 1));
      }
    } else {
      // If the file size is below 4 MB, send the entire file
      res.status(200);
      res.setHeader('Content-Length', fileSize);
      res.write(pdfBuffer);
    }

    // End the response
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while downloading the file');
  }
});


  
 
  
  
app.use('/api',require('./routes/admin'))

const PORT = process.env.PORT
app.listen(PORT,
    ()=>{
          console.log(`starting http://localhost:${PORT}`);
    }
)

