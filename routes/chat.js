let express = require('express');
let router = express.Router();

const Chat = require('../models/chat');
const ChatRoom = require('../models/chatRoom');



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


// 채팅방 조회
router.get('/getChatRoom', function(req, res, next) {
	// console.log(`/trade/getTrade/서버통신 : trade 조회`)
	//let page = req.params.page;
	//console.log(page);
	ChatRoom.find()
		.then((data)=>{
			res.status(200).json(data);
		}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"getPost DB오류"});
	})
});

// 채팅방 생성 / user1, user2는 각각의 ObjectId
router.post('/createChatRoom', async(req,res)=>{
	try{
		const{user1, user2, postId} = req.body;

		// 새 instance 생성
		const newChatRoom = new ChatRoom({
			buyerId: user1,
			sellerId: user2,
			postId: postId
		})

		console.log(newChatRoom);
		await newChatRoom.save();
		res.json({message:"chatRoom 저장 완료"});
	} catch(err){
		console.log(err);
	}

});

module.exports = router;
