let express = require('express');
let router = express.Router();

const Trade = require('../models/trade');
const User = require("../models/user");

// 거래 조회
router.post('/getTrade', async(req, res) => {
    
    try{
        console.log(`/trade/getTrade/서버통신 : trade 조회`)

        const {
            tradeId
        } = req.body;

        const Trade= await Trade.find({_id:tradeId})
        res.json({ message: "거래가 존재합니다."});
    } catch(err){
        console.log(err);
    }

    
});


// 거래 설정
// location, userList, post ??
router.post('/createTradeTime',async (req, res) => {
    try{
        console.log('/trade/createTradeTime 통신');

        // req.body 저장
        const{
            startTime, endTime, location,sender,receiver
        } = req.body;

        // User.findOne({name:'user1'}).populate('')

        console.log(startTime)

        // 새 instance 생성
        obj = {
            startTime: startTime,
            endTime: endTime,
            location: location,
            isSave: true,
            complete: false,
            sender:sender,
            receiver:receiver,
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

    console.log('/trade/updateTradeTime 실행');

    try {
        // req.body 저장
        let {tradeId, endTime} = req.body;
        console.log(`거래 ID:${tradeId}, 연장된 종료 시간: ${endTime} `);

        await Trade.updateOne(
            { _id: tradeId },
                {
                  $set: {
                      endTime:endTime   
                }
            }
        );

       res.json({ message: "거래 연장이 완료되었습니다." });
    } catch(err){
        console.log(err);
        res.json({ message: false });
    }
});


// 거래 완료
router.post('/endTrade',async (req, res) => {

    console.log('/trade/endTrade 실행');

    try {
        // req.body 저장
        let {tradeId} = req.body;
        console.log(`거래 ID:${tradeId} `);

        await Trade.updateOne(
            { _id: tradeId },
                {
                    $set: {
                      complete:true  
                }
            }
        );

       res.json({ message: "거래가 종료되었습니다." });
    } catch(err){
        console.log(err);
        res.json({ message: false });
    }

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

//사용자 평가
router.post('/userRate', async(req, res) => {
    try{
        let {userId, rating} = req.body;
        console.log(`평가할 유저 ID:${userId} `);

        await User.updateOne(
            { _id: userId },
                {
                    $set: {
                      averageRating: rating
                }
            }
        );
        res.json({message:"사용자 평가를 완료했습니다."});
    } catch (err){
        console.log(err);
        res.json({message:false});
    }

});

module.exports = router;