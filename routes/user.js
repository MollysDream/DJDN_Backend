var express = require('express');
var router = express.Router();

const User = require("../models/user");
const Post = require("../models/post");
const Category = require("../models/category");


router.get('/getUserData', function(req, res, next) {
    const userId = req.query.userId;
    console.log(`**/user/getUserData/서버통신** userID: ${userId}의 사용자 정보 요청`);

    User.findOne({'_id': userId}).then((data)=>{
        res.status(200).json(data);
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


router.get('/testdata', function(req, res, next) {
    console.log('/testdata 서버통신')

    const category = new Category({
        category: {
            'a':false,
            'b':false,
            'c':false,
            'd':false,
            'e':false
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
