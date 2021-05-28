const express = require("express");
const router = express.Router();
const Advertisement = require("../models/advertisement");

const axios = require("axios");

const Point = require("../models/point");
const User = require("../models/user");



router.post("/createAdver", function(req,res,next){
    console.log(`**/data/createAdber/서버통신** 광고 작성 요청`);
    const adverData = req.body;
    console.log(adverData);

    const adver=new Advertisement({
        approve: adverData.approve,
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

router.post('/updateAdver', function(req,res,next){

    const adverData = req.body;

    console.log(adverData);
    
    Advertisement.findOneAndUpdate({'_id':adverData._id},
        {
            title:adverData.title,
            image: adverData.image,
            text:adverData.text,
            price:adverData.price,

        })
        .then((result)=>{
            console.log(`${adverData._id} 광고 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"AdverData DB오류"});
    })

})

router.post('/updateAdverActive', function(req, res, next) {
    const {_id, active} = req.body;
    console.log(`**/advertisement/updateAdverActive/서버통신** 광고 ID:${_id} 상태: ${active}로 수정`)
    console.log(_id);
    Advertisement.findOneAndUpdate({'_id':_id}, {active:active})
        .then((result)=>{
            console.log(`${_id} 광고 활성화상태:${active} 수정 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"updateAdverActive DB오류"});
    })
});

router.post('/updateAdverApprove', function(req, res, next) {
    const {_id, approve} = req.body;
    console.log(`**/advertisement/updateAdverApprove/서버통신** 광고 ID:${_id} 상태: ${approve}로 수정`)
    console.log(_id);
    Advertisement.findOneAndUpdate({'_id':_id}, {approve:approve})
        .then((result)=>{
            console.log(`${_id} 광고 활성화상태:${approve} 수정 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"updateAdverApprove DB오류"});
    })
});

router.delete('/deleteAdver', function(req, res, next) {
    const _id = req.query._id;
    console.log(`**/data/deleteAdver/서버통신** 게시글 ID:${_id} 게시글 삭제`)

    Advertisement.findOneAndDelete({'_id':_id})
        .then((result)=>{
            console.log(`${_id} 게시글 삭제 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"deleteAdver DB오류"});
    })
});

router.get('/getMyAdver', function(req,res,next){
    const userId =req.query.userId;
    console.log(userId);
    Advertisement.find({shopOwner : userId}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getMyAder DB 오류"});
    })
})


router.get('/getAdver', function(req,res,next){
    Advertisement.find().populate('shopOwner').sort({date:-1}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getAdver DB 오류"});
    })
})

router.get('/getAdverByAddressName', function(req,res,next){
    const addressName = req.query.addressName;
    Advertisement.find({addressName:addressName}).populate('shopOwner').sort({date:-1}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getAdverByAddressName DB 오류"});
    })
})

router.post("/createPoint", function(req,res,next){
    console.log(`**/advertisement/createPoint/서버통신** 사용자 포인트 생성`);
    const {email} = req.body;
    console.log(email);
    User.findOne({email:email}).then((userData)=>{

        //console.log(userData);
        const point = new Point({
            point:0,
            user_id:userData._id
        })

        point.save((err, user)=>{
            if(err){
                console.log(err);
                res.status(500).send({error:"DB오류"});
            }else {
                console.log("Point DB 저장완료");
                res.status(200).json(user);
            }
        })


    }).catch(err=>{ //Address.findOne()
        console.log(err);
        console.log('위치정보 Find 에러')
    })





})

module.exports = router;