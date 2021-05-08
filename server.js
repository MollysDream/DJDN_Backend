var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongoose = require('mongoose');

var ObjectID = mongoose.ObjectID;
var db = mongoose.connect('mongodb://localhost:27017/CHAT');
var app = express();
var server = http.Server(app);




// 이거 일단 사용 X
let sample = [
	{ _id: 'room01', members: ['zero_id', 'aero_id']},
	{ _id: 'room02', members: ['nero_id', 'hero_id']},
];

// user 몇명 들어왔나 체크 하려고
var count = 1;

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
	socket.on('joinRoom',(roomName)=>{
		socket.join(roomName);
	})

	// 방 퇴장
	socket.on('leaveRoom',(roomName)=>{
		socket.leave(roomName);
	})

	// 메세지
	socket.on('chat message to server', (msg) => {

		console.log("현재 사용중인 소켓 아이디 : ",socket.id);
		console.log("server에서 지금 메세지 받음 : " + msg[0].text);
		// io.to('room1').emit('chat message to client', msg);
		socket.broadcast.to('room1').emit('chat message to client', msg);
		console.log("client한테 emit함 : " + msg[0].text);
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



