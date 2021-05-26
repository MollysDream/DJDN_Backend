const express = require("express");
const router = express.Router();
const Advertisement = require("../models/advertisement");
const axios = require("axios")


router.post("/createAdver", function(req,res,next){
    console.log(`**/data/createAdber/서버통신** 광고 작성 요청`);
    const adverData = req.body;
    console.log(adverData);

    const adver=new Advertisement({
        active: adverData.active,
        title: adverData.title,
        image: adverData.image,
        text: adverData.text,
        price: adverData.price,
        count: adverData.count,
        shopOwner: adverData.shopOwner,
        latitude: adverData.area.latitude,
        longitude: adverData.area.longitude,
        addressName: adverData.area.addressName,
        location:{coordinates: [adverData.area.longitude, adverData.area.latitude]}
    })
    console.log(adver);

    adver.save((err, user)=>{
        if(err){
            console.log("여기");
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(user);
        }
    })

})

module.exports = router;