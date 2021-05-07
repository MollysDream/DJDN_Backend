var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongoose = require('mongoose');

var ObjectID = mongoose.ObjectID;
var db = mongoose.connect('mongodb://localhost:27017/CHAT');
var app = express();
var server = http.Server(app);

var io = socketio(server);
server.listen(3002, () => console.log('listening on *:3002'));

// Mapping objects to easily map sockets and users.
var clients = {};
var users = {};

// This represents a unique chatroom.
// For this example purpose, there is only one chatroom;
var chatRoomId = 1;

let numUsers = 0;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/chat.html');
});

var count = 1;

io.on('connection', (socket)=>{
	console.log('user connect: ', socket.id);
	var name = 'user' + count++;
	console.log(name);
	io.to(socket.id).emit('change name',name);

	socket.on('connect', (chatRoomId) => {
		console.log('user connect: ', socket.id);
		console.log(chatRoomId);
		socket.join(chatRoomId);
	});


	socket.on('disconnect', (chatRoomId) => {
		console.log('user disconnected: ', socket.id);
		console.log('dcnnt chatRoomId : ',chatRoomId)
		socket.leave(chatRoomId);
	});

	socket.on('chat message', (msg) => {
		console.log(msg);
		io.emit('chat message', msg);
	});

	socket.on('newMessage', (msg) => {
		// we tell the client to execute 'new message'
		// io.emit('newMessage', msg)
		socket.broadcast.emit('newMessage', msg);
		console.log(msg);
		console.log("server에서 지금 메세지 보내는 중");
	});
});

setInterval(() => {
	io.emit('message', new Date().toISOString());
	// console.log("지금 시간 보내는 중");
}, 1000);



