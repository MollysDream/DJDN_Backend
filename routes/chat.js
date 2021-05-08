let express = require('express');
let router = express.Router();

const Chat = require('../models/chat');



// 채팅 조회
router.get('/getChat', function(req, res, next) {
	// console.log(`/trade/getTrade/서버통신 : trade 조회`)
	//let page = req.params.page;
	//console.log(page);
	Chat.find()
		.then((data)=>{
			res.status(200).json(data);
		}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"getPost DB오류"});
	})
});


// 채팅 저장
router.post('/createChat', async(req, res)=>{

	try{
		// 새 instance 생성
		const newChat = new Chat(req.body)
		console.log(newChat);
		await newChat.save();
		res.json({message:"chat 저장 완료"});
	} catch(err){
		console.log(err);
	}

});

module.exports = router;
