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
const { pipeline } = require('stream');

app.get('/pdf/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const response = await axios({
      method: 'GET',
      url: `https://drive.google.com/uc?export=download&id=${fileId}`,
      responseType: 'stream',
    });

    const fileSize = parseInt(response.headers['content-length'], 10);
    const range = req.headers.range;

    if (range) {
      const parts = rangeParser(fileSize, range);

      if (parts) {
        const [start, end] = parts[0];
        res.status(206).set({
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
          'Content-Type': response.headers['content-type'],
        });

        pipeline(response.data, res, { start, end }, (error) => {
          if (error) {
            console.error('Pipeline error:', error);
            res.status(500).send('Error occurred while piping the file');
          }
        });

        return;
      }
    }

    res.status(200).set({
      'Content-Length': fileSize,
      'Content-Type': response.headers['content-type'],
    });

    pipeline(response.data, res, (error) => {
      if (error) {
        console.error('Pipeline error:', error);
        res.status(500).send('Error occurred while piping the file');
      }
    });
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

