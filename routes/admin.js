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




  
  router.get('/submit-data', (req, res) => {
    // Assuming you want to access query parameters
    const { param1, param2 } = req.query;
  
    // Log or process the query parameters as needed
    console.log('Received query parameters:', param1, param2);
  
    // Optionally, perform additional processing or validation here.
  
    // Send a response
    res.status(200).json({ message: 'Data received successfully' });
  });
  
  

module.exports = router;
