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
  const { email } = req.body;

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

 
  const user = await Username.findOne({ email });
  if (user) {
    user.otp = hashedOTP; 
    await user.save();
  } else {
    const newUser = new Username({
      email,
      otp: hashedOTP, 
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
    });
    
    res.setHeader('Set-Cookie', userCookie);

    res.status(200).json({ message: 'OTP is correct' });
  } else {
    res.status(400).json({ message: 'Incorrect OTP' });
  }
});











module.exports = router;
