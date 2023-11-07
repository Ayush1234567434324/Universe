const express = require("express");
const router = express.Router();
const request = require('request');

router.get('/pdf/:id', (req, res) => {
    // Get the 'id' parameter from the request URL
    const id = req.params.id;
  
    // Create the Google Drive link with the provided 'id'
    const googleDriveLink = `https://drive.google.com/file/d/${id}/view`;
  
    // Set the response headers to indicate a PDF file
    res.setHeader('Content-Type', 'application/pdf');
  
    // Extract the file ID from the Google Drive link
    const fileId = googleDriveLink.match(/\/d\/(.+?)\//);
    if (fileId && fileId[1]) {
      const directDownloadLink = `https://drive.google.com/uc?id=${fileId[1]}`;
      
      // Pipe the direct download link to the response
      request(directDownloadLink).pipe(res);
    } else {
      res.status(500).send('Invalid Google Drive link');
    }
});



module.exports = router;