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
router.post('/createTradeTime',async (req, res) => {
    try{
        console.log('/trade/createTradeTime 통신');

        // req.body 저장
        const{
            startTime, endTime, location
        } = req.body;

        // User.findOne({name:'user1'}).populate('')

        console.log(startTime)

        // 새 instance 생성
        obj = {
            startTime: startTime,
            endTime: endTime,
            // workTime: workTime,
            location: location,
            isSave: true,
            complete: false,
            // userList:[user1, user2],
            // chatRoom: chatRoom
        }
        const trade = new Trade(obj);
        await trade.save();
        res.json({ message: "거래 시간 및 장소가 설정되었습니다!", tradeId:trade._id });
    } catch(err){
        console.log(err);
    }
});


// 거래 시간 연장
router.post('/updateTradeTime',async (req, res) =>{

    try {
    console.log('/trade/updateTradeTime 실행');

    // req.body 저장
    let {tradeId, endTime} = req.body;
    console.log(`거래 ID:${tradeId}, 연장된 종료 시간: ${endTime} `);


    // instance 수정
    Trade.findOneAndUpdate({'_id':tradeId}, {endTime:endTime})
      .then((result)=>{
          console.log(`거래 ID ${tradeId}의 시간연장 / workTime  = ${workTime}, endTime  = ${endTime}`);
          console.log('연장된 거래 정보 조회 : '+result);
          res.status(200).json(result);
      }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPost DB오류"});
    })} catch(err){
        console.log(err);
        res.json
    }
});


// 거래 완료
router.post('/endTrade',function (req, res, next){

    console.log('/trade/endTrade 실행');
    let tradeId = req.body;
    console.log(`거래 ID:${tradeId} `);
    Trade.findOneAndUpdate({'_id':tradeId}, {complete:true})
      .then((result)=>{
          console.log(`거래 ID ${tradeId}의 거래 완료 처리`);
          console.log('거래 완료 처리된 거래 정보 조회 : '+result);
          res.status(200).json(result);
      }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPost DB오류"});
    })

});

// 거래 취소
router.post('/deleteTrade', async(req, res) => {
    try{
        await Trade.remove({
            _id:req.body.tradeId
        });
        res.json({message:true});
    } catch (err){
        console.log(err);
        res.json({message:false});
    }

});

module.exports = router;
