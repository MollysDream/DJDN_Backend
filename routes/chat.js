let express = require('express');
let router = express.Router();

const Chat = require('../models/chat');
const ChatRoom = require('../models/chatRoom');



// 채팅 조회
router.get('/getChat', function(req, res, next) {
	// console.log(`/trade/getTrade/서버통신 : trade 조회`)
	//let page = req.params.page;
	//console.log(page);
	const chatRoomId = req.query.chatRoomId;
	console.log("chatRoomID : ", chatRoomId);
	Chat.find({roomId :chatRoomId})
		.then((data)=>{
			res.status(200).json(data);
			console.log("이건 잘 나오냐... ", data );
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
	const currentUserId = req.query.currentUserId;
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


router.get('/getChatRoomByPost', function(req, res, next) {

	const currentUserId = req.query.currentUserId;
	const postId = req.query.postId;

	ChatRoom.find({postOwnerId: currentUserId, postId:postId})
		.then((data)=>{
			res.status(200).json(data);
		}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"DB오류"});
	})
});



// 채팅방 생성 / postOwnerId, hostId는 각각의 ObjectId
router.post('/createChatRoom', function(req,res){
		const{postOwnerId, hostId, postId} = req.body;

		// 새 instance 생성
		const newChatRoom = new ChatRoom({
			postOwnerId: postOwnerId,
			hostId: hostId,
			postId: postId
		})

		console.log(newChatRoom);
		newChatRoom.save()
		.then((data)=>{
			res.status(200).json(data);
			console.log("여기다", data);
		}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"DB오류"});
	})

});

router.post('/getLatestChat',function(req,res){
	const {chatRoomId} = req.body;

	Chat.findOne({roomId:chatRoomId}).sort({$natural:-1})
		.then(data=>{
			res.status(200).json(data);
			console.log(`최근 채팅 불러옴!! 채팅방 Id: ${chatRoomId}`);
		}).catch(err=>{
			console.log(err);
			res.status(500).send({error:"getLatestChat DB오류"})
	})
})

module.exports = router;
