const express = require("express");
const router = express.Router();
const Manga = require('../models/Admin') 
const Username = require('../models/Username')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cookie = require('cookie');

router.use(bodyParser.json());




router.post('/username', async (req, res) => {
  const { name, email, password, phone, country } = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
   
    const hashedPassword = await bcrypt.hash(password, 10); 

   
    
    const newUser = new Username({
      name,
      email,
      password: hashedPassword,
      phone,
      country,
    });

    await newUser.save(); 

    res.status(201).json({ message: 'User data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error hashing and saving the user data' });
  }
});



  

router.post('/submit-data', (req, res) => {
   
  const formData = req.body;
  const manga = new Manga(formData);
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
      titles.forEach((title) => {
        router.get(`/${title}/manga`, (req, res) => {
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












router.post('/send-email', async (req, res) => {
  const { name,email,password,country,mobile } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'tunehub052@gmail.com',
      pass: 'jsprftzsptnomwpl',
    },
  });


  const otp = Math.floor(Math.random() * 90000) + 10000;
  const otpString = otp.toString();

  
  const hashedOTP = await bcrypt.hash(otpString, 10); 

  const mailOptions = {
    from: 'tunehub052@gmail.com',
    to: email, 
    subject: 'WELCOME TO WEEBMANIA',
    text: otpString, 
    html: `<p style="font-size:80px">${otpString}</p>`,
  };
  console.log(otpString)
 
  const user = await Username.findOne({ email });
  if (user) {
    user.otp = hashedOTP; 
    await user.save();
  } else {

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new Username({
      name,
      email,
      otp: hashedOTP, 
      password:hashedPassword,
      country,
      mobile
    });
    await newUser.save();
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});



router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;
  const user = await Username.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isMatch = await bcrypt.compare(otp, user.otp);

  if (isMatch) {
    const userCookie = cookie.serialize('userInfo', JSON.stringify(user), {
      httpOnly: true,
      maxAge: 604800000000,
      domain: 'localhost', // Change this to match your domain
      sameSite: 'None', // Set the SameSite attribute to "None"
      secure: true, // Make sure to set this for secure (HTTPS) websites
    });
    
    
    res.setHeader('Set-Cookie', userCookie);

    res.status(200).json({ message: user});
  } else {
    res.status(400).json({ message: 'Incorrect OTP' });
  }
});



router.post('/verify2', async (req, res) => {
  const { email, password } = req.body;
  const user = await Username.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const userCookie = cookie.serialize('userInfo', JSON.stringify(user), {
      httpOnly: true,
      maxAge: 604800000000,
      domain: 'localhost', // Change this to match your domain
      sameSite: 'None', // Set the SameSite attribute to "None"
      secure: true, // Make sure to set this for secure (HTTPS) websites
    });
    
    
    res.setHeader('Set-Cookie', userCookie);

    res.status(200).json({ message: user});
  } else {
    res.status(400).json({ message: 'Incorrect OTP' });
  }
});


/*router.get('/test', async (req, res) => {
  try {
    const mangaId = '651b1e1bca01158798105fb6'; // Replace with the actual Manga ID
    console.log('Finding manga with ID:', mangaId);

    const manga = await Manga.findById(mangaId).exec();
    console.log('Found manga:', manga);

    if (!manga) {
      console.log('Manga not found');
      return res.status(404).json({ error: 'Manga not found' });
    }

    // Ensure manga.page is initialized
    manga.page = manga.page || {};

    // Push a new item into the url array
    manga.url.push(
      { key: "1HcMdYf9K7iE6xVhyVQ_4PlzTbrvhFUvc", discription: "God of Destruction Premonition" },
      { key: "1JN5QUf_fwgNuVLW8K7xwjCUcrZPCd5U5", discription: "Goku Defeated" },
      { key: "1zFK1CRUHxuekC2CbTCHK-8Rf1UKWng-v", discription: "The Rage of Beerus" }
    );

    // Update the pagefront and pageback properties
    manga.page.pagefront = "1J7_xI6ytTnFHuLT8Oo0vmgvOdWmcGfSc"; // Replace with the actual URL for the pagefront
    manga.page.pageback = "1haBoeOqPYvd9y6gE1oYwAV-jIaR-17ZC";   // Replace with the actual URL for the pageback

    // Save the updated document
    await manga.save();
    
    console.log('Manga saved successfully:', manga);
    res.json(manga); // Return the updated manga document
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});*/












const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

// Replace the content with your actual service account key content
const credentials = {
  "type": "service_account",
  "project_id": "weebmania",
  "private_key_id": "acf69a637ab17d853396abfe14bfb13711b391c9",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDbTraMeAQrrokm\nAaynHcfIXyrSV4txbqoauQEvnvIInjOD9YzmpeY0fXQGHNGSwiGwEosWD98PhnOo\nZTQtxmMiCgQEUcrIDjZeafKFV+i777rpXIOUG0a45Ltbta6Rf72gJCUlzQ56d954\nhoCO/Agj4gdgmzlDguSXj3Nq7NNPKifYU2r+ynkZh27SGEexVE8zSQ4OWsxUFaFM\nO/YDlSBTgxQkjxx3Js6p5QsaQOpwZhjMtlTuP2UNyVY0G7Y9Uhq0g3870RJw1dXi\nGBUlnJJ2jOb/4jxRbJ//BAE1M/g8TqcC4wk93A5rLswKNH8IpdNvVxbu6QY1tYPl\ndovjHdzLAgMBAAECggEANdV3Izks0Oo5uW4syyMY0RtnYBXkYXZoZEHoxB9Qy4PG\nIozqxw2PWnA3RG7blRp5eYa7xLElsOJwzrP1II1z9T2fKc5IKF6wwvFf+pKPS174\nM2Ol2vvtGuLvCP6quQWx7zcgNUzGUpLNNinSMgc1GlXYOMMxxdxCL+AjVWqIHoTG\nqQzEHdNvDfHbgo9CyD3TKY/mOTEdPI59bOUZYibgjFDCtPNyqaIjjerJy+tNztny\npedry0OuNk/demcuWwoWyDLmTbmr7+h2xo4B08Z1XEGZd7xP1fz9G3hCarHfI4uQ\nXSkBApuIYoO6EQQF2VtKq+oJKnn3PQCfnF28E9bL9QKBgQD4YGXOo+wbYdxGxXNt\nOxQzflw73pCQJSQ+fnJ2qomcogztiXxTl6m4cGTvIZIVdTnUagLfBL6+vfvjy63w\n+H02rK4RtgGzJRU4wXYhcAxuqSQx8Jthc8fvc7gCoMFVxqxwrD2/P7RxOKqGjAoG\nRLezKwJAEQETy0jMn/pNwemitQKBgQDiCegynJy+LQc2tuqcRBlWeaPrTcncvhmz\npszHcAToSLWeje1Ckvtw2R43mdsdOTzG39LajwmlFB6jZEn0TdrqqWc488Lapute\neEbcK2DQAFC0+YsMgm7UpLQ79PqxdXSTRk4dc1pmgvqXUkrbVxdVDhCaa9LmCzxG\nZp5cazuxfwKBgQCdm/YeiXCC87dnBVa4oruv7Wgz6YiMn7T/HxgdaxxF06MmfI7z\nMJNXYaL7B69+hFO9EcReptEvkrkrlQz8k4JJVoxi2r77YfW0fTcsAsEw244HTqoa\nzfC6ZxEGQeJNPvQfz3yjRpaHHjE/jc+yqJp1TD5yTxgC6oV4q6+W9gz+3QKBgCx6\nhpZu+ujxM1ow5DmbrOC3TuoehHpLbgNL7z/PayfKJvLsOqO/CHtMPgXy4Ir/mFYJ\n9RPM0bkKHH1KXsMUDt/eNdGfJdigv+/2+vqYDpTfewIhmJr9j5GIV2705d/FnQrd\n6sEg0ckaPPVJ3DENEipKejnovbdGvrWbu82zzCtBAoGBAPQLCTNlltdVwtYaIhRY\nXfs3ByTRpJw6Wi4113+eApu+uaaiWbMQx3y2y5Az3Zms0K+hiCXOCt9UmjM/c297\n7MWxM13FFk0ULlM7bZggwNQI4PnbjR2xzvyQD3WP1r4T2hlXFv0pHPwSPyvH6o6y\n4aSwib+lKQEUnGmQM6IrmgjA\n-----END PRIVATE KEY-----\n",
  "client_email": "weebmania@weebmania.iam.gserviceaccount.com",
  "client_id": "116523413424415307342",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/weebmania%40weebmania.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Google Drive API
const auth = new GoogleAuth({
  credentials: credentials,
  scopes: 'https://www.googleapis.com/auth/drive',
});
const driveService = google.drive({ version: 'v3', auth });

// Define the searchFiles function
async function searchFiles(id) {
  const files = [];

  let pageToken = null;
  try {
    do {
      const res = await driveService.files.list({
        q: "'" + id + "' in parents",
        fields: 'nextPageToken, files(id, name, mimeType, size)',
        spaces: 'drive',
        pageSize: 100,
        pageToken: pageToken,
      });

      // Add the files from the current page to the files array
      Array.prototype.push.apply(files, res.data.files);

      pageToken = res.data.nextPageToken;
    } while (pageToken);

    // Log the sorted files (optional)
    files.forEach(function (file) {
      console.log('Found file:', file.name, file.id, file.mimeType);
    });

    // Return the sorted files
    return files;
  } catch (err) {
    // Handle error
    console.error('Error searching files:', err);
    throw err;
  }
}




router.get('/check', async (req, res) => {
  try {
    const folderId = req.query.folderId; // Extract folderId from query parameters
    const files = await searchFiles(folderId);
    
    // Rest of your code...
    const customSort = (a, b) => {
      const regex = /page-(\d+)\.pdf/;
      const getNumber = (filename) => parseInt(filename.match(regex)[1], 10);
    
      const numberA = getNumber(a.name);
      const numberB = getNumber(b.name);
    
      return numberA - numberB;
    };
    
    // Sort files by the numeric part of their names in ascending order
    files.sort(customSort);
    
    // Include the sorted files in the JSON response

    res.json({ files });
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/manga/:mangaId/url/:urlId/chat", async (req, res) => {
  const mangaId = req.params.mangaId;
  const urlId = req.params.urlId;
  const { user, text ,email} = req.body;

  try {
    const manga = await Manga.findById(mangaId);

    if (!manga) {
      return res.status(404).json({ error: "Manga not found" });
    }

    const urlObject = manga.url.find((url) => url.id === urlId);

    if (!urlObject) {
      return res.status(404).json({ error: "URL not found in manga" });
    }

    // Push the new chat message into the chat array of the specific URL
    urlObject.chat.push({ user, text,email });

    await manga.save();

    res.status(201).json(manga);
  } catch (error) {
    console.error("Error posting chat message:", error);
    res.status(500).json({ error: "Error posting chat message" });
  }
});



module.exports = router;
