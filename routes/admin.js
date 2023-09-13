const express = require("express");
const router = express.Router();
const manga = require("../models/Admin")
router.get('/',(req,res)=>{
    obj={
        a:'thios',
        number:34
    }
    res.json(obj);
})
module.exports =  router