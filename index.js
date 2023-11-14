const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config()
const connectDB = require('./db')

connectDB();

app.use(express.json())
app.use(cors());


const axios = require('axios');



app.get('/pdf/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const response = await axios({
      method: 'GET',
      url: `https://drive.google.com/uc?export=download&id=${fileId}`,
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', `attachment; filename=file.pdf`);
    res.setHeader('Content-Type', response.headers['content-type']);

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

