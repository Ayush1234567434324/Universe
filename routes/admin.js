const express = require("express");
const router = express.Router();
const Manga = require('../models/Admin') 
const bodyParser = require('body-parser');
router.use(bodyParser.json());


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



router.get('/manga', (req, res) => {
  Manga.find() // Find all manga documents in the collection
    .then((mangaData) => {
      res.json(mangaData); // Send the manga data as a JSON response
    })
    .catch((error) => {
      console.error('Error retrieving manga data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/:title/manga', (req, res) => {
  const mangaTitleParam = req.params.title; // Get the manga title from the URL parameter
  const mangaTitle = mangaTitleParam.replace(/-/g, ' '); // Replace dashes with spaces

  Manga.findOne({ title: mangaTitle }) // Find the manga document with the specified title
    .then((mangaData) => {
      if (mangaData) {
        res.json(mangaData); // Send the manga data as a JSON response
      } else {
        res.status(404).json({ error: 'Manga not found' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving manga data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});






module.exports = router;
