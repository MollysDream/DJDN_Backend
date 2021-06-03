var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongoose = require('mongoose');
const User = require('./models/user');
const ChatRoom = require('./models/chatRoom');
const Chat = require('./models/chat');
const Trade = require('./models/trade');

var ObjectID = mongoose.ObjectID;
var db = mongoose.connect('mongodb://localhost:27017/DJDN');
var app = express();
var server = http.Server(app);

var admin = require('firebase-admin');
var serviceAccount = require("./key/appKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
  });

// user 몇명 들어왔나 체크 하려고
var count = 1;

let postOwnerId;

// chatRoomId 조회를 위함!
let chatRoomId;

// tradeRoomId 조회를 위함!
let tradeRoomId;



// 서버 연결
var io = socketio(server);
server.listen(3002, () => console.log('listening on *:3002'));



app.get('/', (req, res) => {
	res.sendFile(__dirname + '/chat.html');
});



//소켓 연결됨
io.on('connection', (socket)=>{

	console.log('현재 소켓 아이디 :' + socket.id);
	var name = 'user' + count++;
	console.log(name);


	socket.on('connect', (chatRoomId) => {
		// console.log('user connect: ', socket.id);
		// console.log('채팅룸 : ' + chatRoomId);

	});


	socket.on('disconnect', (chatRoomId) => {
		// console.log('user disconnected: ', socket.id);
		// console.log('채팅룸 : ',chatRoomId)
	});


	// 방 입장
	socket.on('joinRoom',(chatRoomId)=>{
		socket.join(chatRoomId);
		console.log("joinRoom 실행됐다!! 방 번호 : " + chatRoomId);
		chatRoomId = chatRoomId;
	});

	// 방 퇴장
	socket.on('leaveRoom',(chatRoomId)=>{
		socket.leave(chatRoomId);
		console.log("leaveRoom 실행됐다!! 방 번호 : " + chatRoomId);

	});


	// postOwnerId, hostId
    socket.on('searchChatRoom',(postOwnerId, postOwnerNick, hostId)=>{
		console.log("postOwnerId : ", postOwnerId );
		console.log("hostId : ", hostId);

			// postOwnerId = postOwnerId;

		/*
		* 여기서 가져온 buyerId, sellerId로 채팅방 조회
		* ChatRoom.find({buyerId: ~~})
		*
		* 해서 위에 전역변수로 설정해놓은 chatRoomId에 찾은 ChatRoom의 Id 저장
		*  chatRoomId = ChatrRoom._id(우리가 찾은거,)
		*
		* socket.join까지 하면 좋겠다~		*
		*/

	});


	// 메세지
	socket.on('chat message to server', async (msg, roomId) => {
		//console.log("현재 사용중인 소켓 아이디 : ",socket.id);
		//console.log("server에서 지금 메세지 받음 : " + msg[0].text);
		// io.to('room1').emit('chat message to client', msg);


		/*
		* 여기서 이제 room1을 어떻게 처리할것이냐!? 이게 문제지요!
		* 위에 socket.on('usersId',(buyerId, buyerNick, sellerId, sellerNick)
		* 요기서 전역변수로 저장해놓은 chatRoomId를 불러온다!
		* 그래서 여기 'room1'에 chatRoomId 전역변수를 집어 넣는다!?
		*/

		/*
		* 푸시알림을 해봅시다.
		* 먼저, chatroom정보를 가져와요
		* 다음으로, 각 id를 이용해 chatRoom에 속해 있는 사용자 두 명을 가져옵시다.
		* 가져온 사용자의 두 명의 닉네임과 fcm token값을 가져옵시다.
		* 지금 보내는 메시지(msg)가 누구냐에 따라 각 상대방에게 알림이 가도록 합시다.
		* 푸시 알림 메시지의 포맷을 정해줍니다 -> title,tag 등..
		* sendFCM 메시지를 통해 메시지 보냅시다!
		 */

		console.log("채팅방 아이디 : " + roomId);
		const room = await ChatRoom.findOne(
			{_id: roomId},
		);

		const chat = await Chat.findOne(
			{roomId:roomId}).sort({$natural:-1}
		)

		if(!room){
			console.log("채팅방이 존재하지 않습니다")
			return;
		}

		const postOwner = await User.findOne(
			{_id: room.postOwnerId},
		)

		if(postOwner){
			// console.log("postOwner를 찾았습니다! "+postOwner.firebaseFCM)
		}

		const host = await User.findOne(
			{_id: room.hostId},
		)

		if(host){
			// console.log("host를 찾았습니다! "+host.firebaseFCM)
		}

		const _room ={
			postOwnerId: postOwner._id,
			postOwnerNickName: postOwner.nickname,
			postOwnerFCM: postOwner.firebaseFCM,
			hostNickName: host.nickname,
			hostFCM: host.firebaseFCM,
		}

		let fcm;
		let notifyNickName;
		// let notifyProfile;

		if (msg[0].user._id == _room.postOwnerId) {
			notifyNickName = _room.postOwnerNickName;
			fcm = _room.hostFCM;
			// console.log('host fcm: ', fcm);
		} else {
			// console.log("현재 id는 "+chat.senderId);
			// console.log("현재 상대방 id는 "+ _room.postOwnerId);
			notifyNickName = _room.hostNickName;
			fcm = _room.postOwnerFCM;
			// console.log("host nickname")
			// console.log('postOwner fcm:'+fcm);
		}

		console.log("이제 다시 클라이언트에게 보낸다. 프론트에서 받은 새메세지 출력해야돼! 메세지 내용은, "+ msg[0].text)
		socket.join(roomId);
		socket.broadcast.to(roomId).emit('chat message to client', msg);

		const message = {
			notification: {
			  title: notifyNickName,
			  tag: notifyNickName,
			  body: msg[0].text ? msg[0].text : '',
			},
			data: {
			  type: 'Chat',
			  senderId: msg[0].user._id,
			},
		  };
		  if (fcm){
		   admin.messaging().sendToDevice(fcm, message, { priority: 'high' })
			.then((response) => {
				// console.log(response.results);
				return true;
			})
			.catch((error) => {
				// console.log('Error sending message:', error);
				return false;
			});
		  }


		  console.log(msg);

	});

	// 방 입장
	socket.on('joinTradeRoom',(tradeId)=>{
		socket.join(tradeId);
		console.log("tradeRoom 실행됐다!! 방 번호 : " + tradeId);
		tradeRoomId = tradeId;
	});

	// 거래 연장
	socket.on('extend endTime',async(tradeId,endDateTime, userId)=>{



		console.log("안녕 연장");
		const trade = await Trade.findOne(
			{_id: tradeId},
		);

		if(!trade){
			console.log("거래가 존재하지 않습니다")
			return;
		}

		const sender = await User.findOne(
			{_id: trade.sender},
		)

		if(sender){
			// console.log("sender를 찾았습니다! "+sender.firebaseFCM)
		}

		const receiver = await User.findOne(
			{_id: trade.receiver},
		)

		if(receiver){
			// console.log("receiver를 찾았습니다! "+receiver.firebaseFCM)
		}


		let fcm;
		let notifyNickName;
		// let notifyProfile;

		if (userId == sender._id) {
			notifyNickName = sender.nickname;
			fcm = receiver.firebaseFCM;

		} else {
			notifyNickName = receiver.nickname;
			fcm = sender.firebaseFCM;
		}


		console.log("이제 다시 클라이언트에게 보낸다. 프론트에서 받은 새 연장 시간 출력해야돼! 새로운 종료시간은, "+ endDateTime)
		socket.join(tradeRoomId);
		socket.broadcast.to(tradeRoomId).emit('extend endTime to client', endDateTime);

		const message = {
			notification: {
			  title:notifyNickName +"님이",
			  tag: notifyNickName,
			  body: "거래시간이 10분 연장하였습니다.",
			},
			data: {
			  type: 'Extend',
			  senderId: userId.toString(),
			},
		  };

		  if (fcm){
		   console.log("fcm token은 "+fcm)
		   console.log("message는 "+message.data.type)

		   admin.messaging().sendToDevice(fcm, message, { priority: 'high' })
			.then((response) => {
				console.log("연장 알림이 성공적으로 되었습니다!");
				return true;
			})
			.catch((error) => {
				console.log('Error sending message:', error);
				return false;
			});
		  }

	});

	// 거래 종료 제안
	socket.on('suggest tradeEnd',async(tradeId)=>{
		const trade = await Trade.findOne(
			{_id: tradeId},
		);

		if(!trade){
			console.log("거래가 존재하지 않습니다")
			return;
		}

		const sender = await User.findOne(
			{_id: trade.sender},
		)

		if(sender){
			// console.log("sender를 찾았습니다! "+sender.firebaseFCM)
		}

		const receiver = await User.findOne(
			{_id: trade.receiver},
		)

		if(receiver){
			// console.log("receiver를 찾았습니다! "+receiver.firebaseFCM)
		}

		console.log("이제 다시 클라이언트에게 보낸다. 프론트에서 종료 제안 출력해야돼!")
		socket.join(chatRoomId);
		socket.broadcast.to(chatRoomId).emit('suggest tradeEnd to client');

		const message = {
			notification: {
			  title: sender.nickname +"님이",
			  tag: sender.nickname,
			  body: "거래 종료 제안을 했습니다.",
			},
			data: {
			  type: 'Suggest',
			  senderId: sender._id,
			},
		  };

		  if (receiver.firebaseFCM){
		   admin.messaging().sendToDevice(receiver.firebaseFCM, message, { priority: 'high' })
			.then((response) => {
				// console.log(response.results);
				return true;
			})
			.catch((error) => {
				// console.log('Error sending message:', error);
				return false;
			});
		  }

	});

	// 거래 종료 동의
	socket.on('end trade',async(tradeId)=>{

		const trade = await Trade.findOne(
			{_id: tradeId},
		);

		if(!trade){
			console.log("거래가 존재하지 않습니다")
			return;
		}

		const sender = await User.findOne(
			{_id: trade.sender},
		)

		if(sender){
			// console.log("sender를 찾았습니다! "+sender.firebaseFCM)
		}

		const receiver = await User.findOne(
			{_id: trade.receiver},
		)

		if(receiver){
			// console.log("receiver를 찾았습니다! "+receiver.firebaseFCM)
		}

		console.log("이제 다시 클라이언트에게 보낸다. 프론트에서 받은 거래종료동의를 출력해야해 ")
		socket.join(chatRoomId);
		socket.broadcast.to(chatRoomId).emit('end trade to client');

		const message = {
			notification: {
			  title: sender.nickname +"님이",
			  tag: sender.nickname,
			  body: "거래 종료 동의했습니다.",
			},
			data: {
			  type: 'EndTrade',
			  senderId: sender._id,
			},
		  };

		  if (receiver.firebaseFCM){
		   admin.messaging().sendToDevice(receiver.firebaseFCM, message, { priority: 'high' })
			.then((response) => {
				// console.log(response.results);
				return true;
			})
			.catch((error) => {
				// console.log('Error sending message:', error);
				return false;
			});
		  }

	});


});

// 테스트
setInterval(() => {
	io.emit('message', new Date().toISOString());
	// console.log("지금 시간 보내는 중");
}, 1000);

