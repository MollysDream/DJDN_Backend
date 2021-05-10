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
		res.status(500).send({error:"chat 가져오기 DB오류"});
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

	ChatRoom.find()
		.then((data)=>{
			res.status(200).json(data);
		}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"DB오류"});
	})
});


// 현재 내가 채팅하는 모든 채팅방 조회 : 채팅 탭에서 사용할거 (태섭)
router.get('/getChatRoomById', function(req, res, next) {

	// 인자로 받아오는거 : 현재 로그인되어있는 사용자 Id
	const {currentUserId} = req.body

	// 인자로 받아온거 사용 -> buyerId 또는 sellerId 둘 중 하나라도 해당되면 채팅방 return.
	ChatRoom.find()
		.or([{postOwnerId: currentUserId},{hostId: currentUserId}])
		.then((data)=>{
			res.status(200).json(data);
		}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"DB오류"});
	})
});



// 채팅방 생성 / postOwnerId, hostId는 각각의 ObjectId
router.post('/createChatRoom', async(req,res)=>{
	try{
		const{postOwnerId, hostId, postId} = req.body;

		// 새 instance 생성
		const newChatRoom = new ChatRoom({
			postOwnerId: postOwnerId,
			hostId: hostId,
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
