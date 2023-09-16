const express = require("express");
const router = express.Router();
const Manga = require('../models/Admin') 
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

router.use(bodyParser.json());

// Use cors middleware
router.use(cors());


router.get('/',(req,res)=>{
  obj={
      a:'thios',
      number:34
  }
  res.json(obj);});


router.post('/submit-data', (req, res) => {
   
  const formData = req.body;
  
  // Assuming you have a Mongoose model Manga
  const manga = new Manga(formData);
  
  // Save the data to the MongoDB database
  manga.save()
    .then(() => {
      console.log('Data saved successfully:', formData);
      res.json({ message: 'Data received and saved successfully' });
    })
    .catch((error) => {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
