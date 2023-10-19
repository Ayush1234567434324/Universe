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
  Manga.find()
    .then((mangaData) => {
      const titles = mangaData.map((manga) => manga.title.replace(/ /g, '').toLowerCase());
      res.json(mangaData);
      // Iterate through the titles and define a route for each one
      titles.forEach((title) => {
        router.get(`/${title}/manga`, (req, res) => {
          // Find the manga data for this title
          const manga = mangaData.find((manga) => manga.title.replace(/ /g, '').toLowerCase() === title);
          if (manga) {
            res.json(manga);
          } else {
            res.status(404).json({ error: 'Manga not found' });
          }
        });
      });

    
     
    })
    .catch((error) => {
      console.error('Error retrieving manga data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});








module.exports = router;
