var express = require('express');
var router = express.Router();

const User = require("../models/user");
const Post = require("../models/post");
const Category = require("../models/category");


/* GET users listing. */
router.get('/getUserData', function(req, res, next) {
    const email = req.query.email;
    console.log(`**/user/getUserData/서버통신** ${email}의 사용자 정보 요청`)

    User.findOne({'email':email}).then((data)=>{
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


router.get('/test', function(req, res, next) {
    console.log('/user/test 서버통신 TEST')

    User.find({}).then((info)=>{
        res.status(200).json(info);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"DB오류"});
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

router.get('/signup', function(req, res, next) {
    console.log('/user/signup 회원가입 정보 입력받음')

    User.find({}).then((info)=>{
        res.status(200).json(info);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"DB오류"});
    })
});

router.post('/write', function(req,res,next){
    //const{title, content} = req.body;
    console.log("서버 /user/write POST실행");

    /*const user=new User({
        nickname: title,
        name: content
    })*/

    const{title,content,category,tag,view,date} = req.body;
    const user=new Post({
        title: title,
        content: content,
        category: category,
        tag: tag,
        view: view,
        date: date

    })

    user.save((err, user)=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(user);
        }
    })
})

module.exports = router;
