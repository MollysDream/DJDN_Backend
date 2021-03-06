var express = require('express');
var router = express.Router();

const User = require("../models/user");
const Post = require("../models/post");
const Category = require("../models/category");
const Certificate = require("../models/certificate");
const Admin = require("../models/admin");


router.get('/getUserData', function(req, res, next) {
    const userId = req.query.userId;
    console.log(`**/user/getUserData/서버통신** userID: ${userId}의 사용자 정보 요청`);

    User.findOne({'_id': userId}).then((data)=>{
        res.status(200).json(data);
        // console.log(data.nickname);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getUserData DB오류"});
    })
});

router.post('/updateUserCategoryAndSort', function(req, res, next) {
    const {userId, newUserCategory, newSort} = req.body;
    console.log(`**/user/updateUserCategoryAndSort/서버통신** ${newUserCategory} ${newSort} 사용자 ID:${userId} 카테고리 정보 수정`)

    User.findOneAndUpdate({'_id':userId}, {category:newUserCategory, sort:newSort})
        .then((result)=>{
        console.log(`${userId} 사용자 카테고리 수정 완료`);
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"updateUserCategoryAndSort DB오류"});
    })
});

router.post('/updateUserAddressIndex', function(req, res, next) {
    const {userId, addressIndex} = req.body;
    console.log(`**/user/updateUserAddressIndex/서버통신** 사용자 ID:${userId} // 인덱스: ${addressIndex} 사용자가 사용할 주소인덱스 수정`)

    User.findOneAndUpdate({'_id':userId}, {addressIndex:addressIndex})
        .then((result)=>{
            console.log(`${userId} 사용자 주소인덱스:${addressIndex} 수정 완료!!`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"updateUserAddressIndex DB오류"});
    })
});

router.post('/updateUserProfile', function(req, res, next) {
    const {userId,editNickname, editImage} = req.body;
    console.log(`**/user/updateUserProfile/서버통신** 닉네임: ${editNickname} // 사용자 ID:${userId} 사용자 프로필 수정`)

    User.findOneAndUpdate({'_id':userId}, {nickname:editNickname, profileImage: editImage})
        .then((result)=>{
            console.log(`${userId} 사용자 // 닉네임:${editNickname} 수정 완료!!`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"updateUserProfile DB오류"});
    })
});

router.post('/addKeyword', function(req, res, next) {
    const {userId,keyword} = req.body;
    console.log(`**/user/addKeyword/서버통신** 키워드: ${keyword} // 사용자 ID:${userId} 사용자 키워드 추가`)

    User.findOneAndUpdate({'_id':userId}, {$push:{keyword:keyword}})
        .then((result)=>{
            console.log(`${userId} 사용자 // 키워드:${keyword} 추가 완료!!`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"addKeyword DB오류"});
    })
});

router.post('/deleteKeyword', function(req, res, next) {
    const {userId,keyword} = req.body;
    console.log(`**/user/deleteKeyword/서버통신** 키워드: ${keyword} // 사용자 ID:${userId} 사용자 키워드 추가`)

    User.findOneAndUpdate({'_id':userId}, {$pull:{keyword:keyword}})
        .then((result)=>{
            console.log(`${userId} 사용자 // 키워드:${keyword} 삭제 완료!!`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"addKeyword DB오류"});
    })
});

router.post('/addCertificate', function(req, res, next) {
    const {userId,title,text,certificateImage} = req.body;
    console.log(`**/user/addCertificate/서버통신** 자격증: ${title} // 사용자 ID:${userId} 사용자 키워드 추가`)


    const certificate = new Certificate({
        title:title,
        text:text,
        certificateImage:certificateImage,
        user_id:userId
    })

    certificate.save((err, certificate)=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("자격증 DB 저장완료");
            res.status(200).json(certificate);
        }
    })

});

router.get('/getUserCertificate', function(req, res, next) {
    const userId = req.query.userId;
    console.log(`**/user/getUserCertificate/서버통신** userID: ${userId}의 자격증 정보 요청`);

    Certificate.find({'user_id': userId}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getUserCertificate DB오류"});
    })
});

router.post('/deleteCertificate', function(req, res, next) {
    const {userId,certificateId} = req.body;
    console.log(`**/user/deleteCertificate/서버통신** 자격증: ${certificateId} // 사용자 ID:${userId} 사용자 키워드 추가`)

    Certificate.findOneAndDelete({'_id':certificateId})
        .then((result)=>{
            console.log(`${certificateId} 자격 삭제 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"deleteCertificate DB오류"});
    })
});

router.post('/checkAdmin', function(req, res, next) {
    const userId = req.body.userId;
    console.log(`**/user/checkAdmin/서버통신** userID: ${userId}이 ADMIN인지 확인`);

    Admin.findOne({'user_id':userId}).then((data)=>{
        console.log(`${userId}의 ADMIN 확인 완료`);
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"checkAdmin DB오류"});
    })

});

router.get('/adminTest', function(req, res, next) {
    console.log('/adminTest 서버통신')

    const admin = new Admin({
        user_id:"60bdfb0478bf0f18cc542454"
    })

    admin.save((err, user)=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(user);
        }
    })

});

router.get('/categoryTest', function(req, res, next) {
    console.log('/testdata 서버통신')

    const category = new Category({
        category: {
            '조립':false,
            '수리':false,
            '운반':false,
            '퇴치':false,
            '설치':false,
            '청소':false,
            '과외':false,
            '디자인':false,
            '제작':false,
        }
    })

    category.save((err, user)=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(user);
        }
    })

});


module.exports = router;
