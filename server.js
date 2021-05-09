var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongoose = require('mongoose');
const ChatRoom = require('../models/chatRoom');


var ObjectID = mongoose.ObjectID;
var db = mongoose.connect('mongodb://localhost:27017/CHAT');
var app = express();
var server = http.Server(app);


// user 몇명 들어왔나 체크 하려고
var count = 1;
var buyerid;



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

	// buyerId, sellerId
    socket.on('usersId',(buyerId, buyerNick, sellerId, sellerNick)=>{
		console.log("buyerId : ", buyerId );
		console.log("buyerNick : ", buyerNick );
		console.log("sellerId : ", sellerId);
		console.log("sellerNick : ", sellerNick);
		buyerid = buyerId;

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
	socket.on('chat message to server', (msg) => {

		//console.log("현재 사용중인 소켓 아이디 : ",socket.id);
		//console.log("server에서 지금 메세지 받음 : " + msg[0].text);
		// io.to('room1').emit('chat message to client', msg);


		/*
		* 여기서 이제 room1을 어떻게 처리할것이냐!? 이게 문제지요!
		* 위에 socket.on('usersId',(buyerId, buyerNick, sellerId, sellerNick)
		* 요기서 전역변수로 저장해놓은 chatRoomId를 불러온다!
		* 그래서 여기 'room1'에 chatRoomId 전역변수를 집어 넣는다!?
		*/

		socket.broadcast.to('room1').emit('chat message to client', msg);
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
