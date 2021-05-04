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
        res.status(500).send({error:"getPost DB오류"});
    })
});

router.post('/updateUserCategory', function(req, res, next) {
    const {userId, newUserCategory} = req.body;
    console.log(`**/user/updateUserCategory/서버통신** ${newUserCategory} 사용자 ID:${userId} 카테고리 정보 수정`)

    User.findOneAndUpdate({'_id':userId}, {category:newUserCategory})
        .then((result)=>{
        console.log(`${userId} 사용자 카테고리 수정 완료`);
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPost DB오류"});
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
