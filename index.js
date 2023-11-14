const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());

const axios = require('axios');
const rangeParser = require('range-parser');

app.get('/pdf/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    // HEAD request to get the file size
    const headResponse = await axios.head(`https://drive.google.com/uc?export=download&id=${fileId}`);
    const fileSize = parseInt(headResponse.headers['content-length'], 10);

    // Set headers for the response
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', 'application/pdf');

    // If the file size exceeds 4 MB, split it into chunks
    if (fileSize > 4 * 1024 * 1024) {
      const rangeHeader = String(req.headers.range || ''); // Ensure rangeHeader is a string
      const parts = rangeParser(fileSize, rangeHeader);

      if (parts && parts.length > 0) { // Check if parts is defined and not empty
        const [start, end] = parts[0];
        res.status(206).set({
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
        });

        // Download and pipe the requested chunk
        const response = await axios({
          method: 'GET',
          url: `https://drive.google.com/uc?export=download&id=${fileId}`,
          headers: {
            Range: `bytes=${start}-${end}`,
          },
          responseType: 'stream',
        });

        response.data.pipe(res);
        return;
      }
    }

    // If the file size is below 4 MB or parts is undefined, send the entire file
    const response = await axios({
      method: 'GET',
      url: `https://drive.google.com/uc?export=download&id=${fileId}`,
      responseType: 'stream',
    });

    res.status(200).set({
      'Content-Length': fileSize,
    });

    response.data.pipe(res);
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

