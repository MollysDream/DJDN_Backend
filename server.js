var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongoose = require('mongoose');
const User = require('./models/user');
const ChatRoom = require('./models/chatRoom');
const Chat = require('./models/chat');

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



// 서버 연결
var io = socketio(server);
server.listen(3002, () => console.log('listening on *:3002'));



app.get('/', (req, res) => {
	res.sendFile(__dirname + '/chat.html');
});



//소켓 연결됨
io.on('connection', (socket)=>{
	// console.log('user connect: ', socket.id);


	console.log('현재 소켓 아이디 :' + socket.id);
	var name = 'user' + count++;
	console.log(name);

	// 이거 일단 필요 없음
	io.to(socket.id).emit('change name',name);


	socket.on('connect', (chatRoomId) => {
		// console.log('user connect: ', socket.id);
		// console.log('채팅룸 : ' + chatRoomId);
		// socket.join('room1');
	});


	socket.on('disconnect', (chatRoomId) => {
		// console.log('user disconnected: ', socket.id);
		// console.log('채팅룸 : ',chatRoomId)
		// socket.leave(chatRoomId);
	});


	// 방 입장
	socket.on('joinRoom',(chatRoomId)=>{
		socket.join(chatRoomId);
	});

	// 방 퇴장
	socket.on('leaveRoom',(chatRoomId)=>{
		socket.leave(chatRoomId);
	});

	// postOwnerId, hostId
    socket.on('searchChatRoom',(postOwnerId, postOwnerNick, hostId)=>{
		console.log("postOwnerId : ", postOwnerId );
		// console.log("postOwnerNick : ", postOwnerNick );
		console.log("hostId : ", hostId);

			// postOwnerId = postOwnerId;

		/*
		* 여기서 가져온 buyerId, sellerId로 채팅방 조회
		* ChatRoom.find({buyerId: ~~})
		*
		* 해서 위에 전역변수로 설정해놓은 chatRoomId에 찾은 ChatRoom의 Id 저장
		*  chatRoomId = ChatrRoom._id(우리가 찾은거,)
		*
		* socket.join까지 하면 좋겠다~
		*
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

		console.log("채팅방 아이디 "+roomId);
		const room = await ChatRoom.findOne(
			{_id: roomId},
		);

		const chat = await Chat.findOne(
			{roomId: roomId}
		)

		if(!room){
			console.log("채팅방이 존재하지 않습니다")
			return;
		}

		const postOwner = await User.findOne(
			{_id: room.postOwnerId},
		)

		const host = await User.findOne(
			{_id: room.hostId},
		)

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

		if (chat.senderId === _room.postOwnerId) {
			notifyNickName = _room.postOwnerNickName;
			fcm = [_room.postOwnerFCM,_room.hostFCM];
			console.log('host fcm: ', fcm);
		} else {
			notifyNickName = _room.hostNickName;
			fcm = [_room.postOwnerFCM,_room.hostFCM];
			console.log("host nickname")
			console.log('postOwner fcm: ', fcm);
		}

		const message = {
			// notification: {
			//   title: notifyNickName,
			//   tag: notifyNickName,
			//   body: msg[0].text ? msg[0].text : '',
			//   // "clickAction":
			// },
			// data: {
			//   type: 'Chat',
			//   senderId: chat.senderId,
			// },
			notification:{
				title: "Portugal vs. Denmark",
				body: "great match!"
			  }
		  };
		  if (fcm){
		   admin.messaging().sendToDevice(fcm, message, { priority: 'high' })
			.then((response) => {
				console.log(response.results);
				return true;
			})
			.catch((error) => {
				console.log('Error sending message:', error);
				return false;
			});
		  }
		  
		socket.broadcast.to('room2').emit('chat message to client', msg);
	});

	// * 테스트용
	// socket.on('newMessage', (msg) => {
	// 	// we tell the client to execute 'new message'
	// 	// io.emit('newMessage', msg)
	// 	socket.broadcast.emit('newMessage', msg);
	// 	console.log(msg);
	// 	console.log("server에서 지금 메세지 보내는 중");
	// });



});

// 신경 쓰지마 테스트용
setInterval(() => {
	io.emit('message', new Date().toISOString());
	// console.log("지금 시간 보내는 중");
}, 1000);

