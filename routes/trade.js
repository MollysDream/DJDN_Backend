let express = require('express');
let router = express.Router();

const Trade = require('../models/trade');
const User = require("../models/user");


// 거래 조회
router.get('/getTrade', function(req, res, next) {

    console.log(`/trade/getTrade/서버통신 : trade 조회`)
    //let page = req.params.page;
    //console.log(page);
    Trade.find()
        .populate('userList')
        .populate('post')
        .then((data)=>{
            // console.log('무야호'+data.userList.length);
             res.status(200).json(data);
        }).catch((err)=>{
            console.log(err);
             res.status(500).send({error:"getPost DB오류"});
        })
});


// 거래 설정
// location, userList, post ??
router.post('/createTradeTime',function (req, res, next){

    console.log('/trade/createTradeTime 통신');

    // req.body 저장
    const{
        startTime, endTime, workTime, location, complete, userList, post
    } = req.body;

    // User.findOne({name:'user1'}).populate('')

    // 새 instance 생성
    const newTrade = new Trade({
        startTime:startTime,
        endTime:endTime,
        workTime:workTime,
        location:location,
        complete:complete,
        userList:userList,
        post: post
    })

    console.log(newTrade);

    newTrade.save(err,trade=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(trade);
        }
    });
});


/*
* 거래 연장
* 선언만 해놓음, instance 조회 & 수정 작성 필요
* */
router.post('/updateTradeTime',function (req, res, next){
    console.log('/trade/updateTradeTime 통신');
    // req.body 저장
    let{endTime, workTime} = req.body;
    // instance 수정
    let fixedTrade;
    console.log(fixedTrade);
});

/*
* 거래 완료
* 선언만 해놓음, instance 조회 & 수정 작성 필요
* */
router.post('/endTrade',function (req, res, next){

    console.log('/trade/endTrade 통신');
    // instance 수정
    let completedTrade;
    console.log(completedTrade);
});

module.exports = router;
