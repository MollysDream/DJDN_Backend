const express = require("express");
const router = express.Router();
const Advertisement = require("../models/advertisement");

const axios = require("axios");

const Point = require("../models/point");
const User = require("../models/user");
const Admin = require("../models/admin");
const Address = require('../models/address')

var admin = require('firebase-admin');
// var serviceAccount = require("../key/appKey.json");

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount)
//   });


router.post("/createAdver", async(req,res)=>{
    try{
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
            phoneNumber:adverData.phoneNumber,

            count: adverData.count,
            shopOwner: adverData.shopOwner,
            latitude: adverData.P1.latitude,
            longitude: adverData.P1.longitude,
            addressName: adverData.addressName,
            location:{coordinates: [adverData.P1.longitude, adverData.P1.latitude]},
            radius:adverData.radius,
            endDate:adverData.endDate
        })

        const advertisement = new Advertisement(adver);
        await advertisement.save();
        res.json({ message: "광고가 저장되었습니다!"});

        //알림 구현
        const sender = await User.findOne(
            {_id: adverData.shopOwner},
        )

        if(sender){
            console.log("sender를 찾았습니다! "+sender.firebaseFCM)
        }

        const receiver = await Admin.findOne(
            {}
        )

        if(receiver){
            console.log("receiver를 찾았습니다! "+receiver)
        }

        const message = {
            notification: {
              title:sender.nickname +"님이 광고를 신청했습니다.",
              tag: sender.nickname,
              body: adverData.title,
            },
            data: {
              type: 'Advertise',
              senderId: sender._id.toString(),
            },
          };

          if (receiver.firebaseFCM){
           console.log("fcm token은 "+receiver.firebaseFCM)
           console.log("message는 "+message.data.type)

           admin.messaging().sendToDevice(receiver.firebaseFCM, message, { priority: 'high' })
            .then((response) => {
                console.log("광고 신청 알림이 성공적으로 되었습니다!");
                return true;
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                return false;
            });
          }
        
    }catch(err){
        console.log(err);
    }

})

router.post('/updateAdver', function(req,res,next){

    const adverData = req.body;

    console.log(adverData);
    let price=adverData.price

    if(adverData.price==''){
        price=0
    }

    Advertisement.findOneAndUpdate({'_id':adverData._id},
        {
            title:adverData.title,
            image: adverData.image,
            text:adverData.text,
            price:price,
            phoneNumber:adverData.phoneNumber,

            latitude: adverData.P1.latitude,
            longitude: adverData.P1.longitude,
            addressName: adverData.addressName,
            location:{type:'Point',coordinates: [adverData.P1.longitude, adverData.P1.latitude]},
            radius:adverData.radius,
            endDate:adverData.endDate

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

const haversine = require('haversine');

router.get('/getAdvertisementPost', async (req,res,next)=>{
    const userId = req.query.userId;

    try{
        //주소 인덱스 얻기위해 현재 사용자 정보 받음
        const userData = await User.findOne({'_id':userId})
        const addressIndex = userData.addressIndex;

        //현재 위치 주소를 얻기위해 정보요청
        const addressData = await Address.findOne({userId:userId, addressIndex:addressIndex});
        const LONGITUDE = addressData.longitude;
        const LATITUDE = addressData.latitude;

        //한국 시간 얻기
        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }
        let krDate = new Date().addHours(9);

        const advertisementData = await Advertisement.find({
            approve:true,
            active:true,
            endDate:{$gte:krDate},
            location:{
                $geoWithin:{
                    $centerSphere: [[LONGITUDE,LATITUDE],2/6378.1]
                }
            }
        })
        //console.log(advertisementData);

        //거리에 속하는 광고만 표시
        const filteredAdvertisementList = advertisementData.filter(async ad =>{
            let start = {
                latitude: LATITUDE,
                longitude: LONGITUDE
            }
            let end = {
                latitude: ad.latitude,
                longitude: ad.longitude
            }
            let distance = haversine(start,end,{unit:'meter'});

            if(distance < ad.radius){
                //사용자 포인트 남았는지 확인
                let pointData = await Point.findOne({user_id:ad.shopOwner})
                if(pointData.point<=1){
                    console.log("포인트 부족으로 광고 정지");
                    await Advertisement.findOneAndUpdate({'_id':ad._id},{active:false})
                }

                return true;
            }
            return false
        })
        //console.log(filteredAdvertisementList);

        if(filteredAdvertisementList.length==0){
            console.log('보여줄 광고 없음!!!')
            res.status(200).json(null);
            return
        }
        //랜덤으로 하나 뽑음
        let randomAdvertisement = filteredAdvertisementList[Math.floor(Math.random() * filteredAdvertisementList.length)]
        console.log(randomAdvertisement);

        await Advertisement.findOneAndUpdate({'_id':randomAdvertisement._id},{$inc:{count:1}})

        //포인트 차감
        await Point.findOneAndUpdate({'user_id':randomAdvertisement.shopOwner},
            {
                $inc:{point: -1}
            }
            )

        res.status(200).json(randomAdvertisement);


    }catch(e){
        console.log(e);
        res.status(500).send({err:e});
    }

})

module.exports = router;
