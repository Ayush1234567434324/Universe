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


/*router.get('/test', async (req, res) => {
  try {
    const manga = await Manga.findById('651b1e1bca01158798105fb6').exec();

    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    // Push a new item into the url array
    manga.url.push("10TI5xrc4heHV1bFeeXUPlyMNEBfs1WCX",
    "1SK_24iBWkezquvm9b__TJfviuAPJ2ZVR",
    "1_a0m-znZar2I5ekw9CNEjFyoTB-UrFuS",
    "1sIGkEgAF6xJtRwJQTfLO-yUu1tXMQ54g",
    "1xkWKATINj8CZDqS27Yr6cLbCVJRLcK4d",
    "11NK8G7OGK_NaTi3xsyaJgzh3dXmpGAmg",
    "1n2SKkASyoqEI7pCtO0FN6JN83smh5C6l",
    "1BGnkYUGwg5eoWi7CGAuNdcrU1iiZ_Spa",
    "1LVw9FTq06ApAiLSCzSGCLqhnNb9_nSTV",
    "18P65p4O3AWC_LCFSFyXGx0uwYmxNcqg-",
    "1w9AN7J6cn8Y-tn66Voax4V68gxeE9Ky0",
    "1VCte6aNCovId37-ZOJ5dXiQf3UWfFRL8",
    "15xmqWLVhWWmuBFeyZWVAHcWGRpHJvYeR",
    "1rn0GY4nsZ1kPLGMrMQ94NsNZ-cW_DDFk",
    "1auUQn0hgXAlQUqvuyktiODp-7D61dLNB",
    "1_veF-LM39TI_OGWpggIyHl1FDhotJTOB",
    "1SytSssFdXYFlclZe3eRkexuKQh1DKdt7",
    "1__9oq-H66h_tVEDFuMDyhGBSuFUNg67W",
    "1nbA-iQiP3Wxf60vfdGaOl1anUGwmPxOM",
    "1LwOhMTvwiD9I456JmMq5PaAk5_ryM8JU",
    "16KtKJkLIMYSs-jwdQckrwkLTBTkN-6dN",
    "1Rs7VG4WbvJEsKFx3Q89b4TU29xHFbySH",
    "1yfnjdxIrO_3AIWqR33EfHlcvDGq6HH3x",
    "1kHRQRmtxlkb9GqXMopYeT5CJ7JpM4aMV",
    "1153TQPazix3Mkv40D-CpapbgSfrs3LRp",
    "13VL_h91YnUardcT5SgEnvr1ceKtjyubp",
    "1hFXTKl9aQzV7uPRMsYMq7lS-Avl2p-ZQ",
    "1tAtVn4YzQPhPccmVmMptWMWP7w8QgM77",
    "1OdI9NkeGZj42RE_aj4wQPmmDJMIF6LXg",
    "1irO5SVbMrRS3jGzBAysj61oQOwVuSedB",
    "1EKNkjY6wW0gSSjX8hi4R8RdHeJx7-zoB",
    "1sJLgUWQcMH3jtzqXTffjkfMaPUYG3Rs7",
    "1hoIP1BGrhBS6lojIECi5r7KEMRfEpF3v",
    "1FikoPexup_Viu5KXheE2hspyFGnJj9pU",
    "1AX231I5n9V2uKcKi6JXN7WynQSb1QDfE",
    "1KLBc99S60XOgfAnDjJuxy8TOAgGmRyfZ",
    "1NUgImd84VFRY-8PL3NuQePfthpkT96Ac",
    "1rdwzumY6rFMZc9lybHxantbIY-WNxxt7",
    "1IuPPz125fJydUktGz1MBOq8r0lRR_vQ4",
    "1TMXM71j74AvqZ3UYuLICoATTgzA2GBFa",
    "1UBz16Q1bwkrrLfGk64HTp7QFXuyMnTmw",
    "1xY5K-NmBtpT7cUiqRbFHH_oLxrNb2CCJ",
    "1MKMtPaTNpxvCq2x3eLkUh-KqNd9WmjOC",
    "1J3hcmWwd0YMsrBmciqLMAabMgvJLV3dp",
    "10cnpl-WBWzt99kLPodmjUSyLJaVUTEl6",
    "1b4TqcUwz6GX5tnpgFIpCHWi7v2ld3hx2",
    "12hw7QNtonnhU_iD8YuSFwWLLEQnaYbzS",
    "1biiEFptPYD5Rrl2nGr4_X4zQv7t1udRC",
    "1Ars0oVoKgSz0fsk3kvCkbiXV7k6l73F5",
    "1t_j4Y4uL7e1yEUTubEvps3AUfOuC7gjG",
    "1kC1EpYj5uHwjMjpIbKsoQy8XqPT7HlIg",
    "1MOFtVtQ-KTjtYfMg5SspI0CpqfyuiDHO",
    "15FwmPy9J1Ir28T0XU2APjBCpzQXFDvou",
    "1t4BgY8qUusEAyjZ9Ng-mB2WOVRkI-BJm",
    "1uJPHSiY9KpXNCbnoJUxd1lzaMUG2X4JO",
    "1oxEF7XH6pFQw8fl4ELOsy3kCsQgg2wj0",
    "1vFjgXocv1qHT5lxeoD7NX-pzm01u5Xzs",
    "1g8IFuRcdgWO8BoWQqKvxL3LGGP4_X3r9",
    "1kzujVkpIDDmQJQoIvdAWTLUpn_PBDw5t",
    "1LiCSnbGntGmKHlUslka3HUdIJnWftSsP",
    "1IFOKyqM8xxe6YL0TNOgqDZekKvRqjbRv",
    "1PbLO3MBOV6xhC_pBBVbyF4DJx0kyysO7",
    "13yqPK7uomyHydVcp2jnqwpkoA2EieMHZ",
    "1n4XNDj8tDHiX4uIkxHC2-is7BiIi7VrQ",
    "1HXECMOMiwmnq7jiXe9hmeiajZHAC1I57",
    "1ArVqhutXrLzKowxD92jGOEZoFpkGV_Jl",
    "1-zu25Yadr6yjy74RiFMvB5DRDnlwItVe",
    "11JrapSwZKkr-XjBC4iQiNlcW_zmD67gK",
    "1SSuPVsOOaJL5WZHTQ_TGIJMa_F-2eZSy",
    "12-yGiXREMDRgMONqBMxOput6si0uaKdO",
    "1plpI7MNckvpvM3ApSBzR-hRMjtDyV4cl",
    "1tSRBYXnq3f4JeftWaEeSj5FOje6u4uxt",
    "1X_qbDP5UBmM_L1crQOSwZzVdn6JeLB3Y",
    "1-El4DZCGLs3o7-VYSUL-k03-HYuc5tck",
    "1NKKssYZXNm-lc0yCMPU5yzxRVBnGJ_0O",
    "1AZTJFVjtYeF_JoEUPe-MevLWl-vV-Vde",
    "1N4TOX3BrCy4xBDbf2GFx8GjMGFj60DvV",
    "1fX8fMjwHxkXAKL0tqslrwvrhFA8ks1xK",
    "1yadwN06UAO-LQFlT7MsGLUWYp1sKxB_C",
    "1fbsE5Dp5yw4ytW12uKkc39oJcHA82UPm",
    "1oWm--awbX0cYscaG99fFKwHwrzV7vwfs"); // Replace 'newUrl' with the URL you want to push

    // Save the updated document
    await manga.save();

    res.json(manga); // Return the updated manga document
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/






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









module.exports = router;
