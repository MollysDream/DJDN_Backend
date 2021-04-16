var express = require('express');
var router = express.Router();

const User = require("../models/user");

/* GET users listing. */
router.get('/test', function(req, res, next) {
    console.log('/user/test 서버통신 TEST')

    User.find({}).then((info)=>{
        res.status(200).json(info);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"DB오류"});
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
    const{title, content} = req.body;
    console.log("서버 /user/write POST실행");
    console.log({title, content})

    const user=new User({
        nickname: title,
        name: content
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
