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
    res.send(formData)
});

module.exports = router;
