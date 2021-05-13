var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');


mongoose.connect('mongodb://localhost:27017/DJDN',{
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongooseAutoInc.initialize(mongoose.connection);


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var dataRouter = require('./routes/data');
var memberRouter = require('./routes/member');
var addressRouter = require('./routes/address');
var tradeRouter = require('./routes/trade');
var chatRouter = require('./routes/chat');
var reportRouter = require('./routes/report');

var app = express();

app.use(cors());
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//사용자 관련 서버요청 ('/user')
app.use('/user', userRouter);
app.use('/data', dataRouter);
app.use('/member', memberRouter);
app.use('/address',addressRouter);
app.use('/trade', tradeRouter);
app.use('/chat', chatRouter);
app.use('/report', reportRouter);



// //소켓 통신
// const server = require("http").createServer(app).listen(3001,()=>
// {
//   console.log("포트 3001번 연결")
// });
// const io = require("socket.io")(server);
// const NEW_MESSAGE_EVENT = "new-message-event";
// const room = "general"


// io.on("connection", (socket) => {
//   // socket.join(room);
//
//   // socket.on(NEW_MESSAGE_EVENT, (data) => {
//   //   io.in(room).emit(NEW_MESSAGE_EVENT, data);
//   // });
//
//   // socket.on("disconnect", () => {
//   //   socket.leave(room);
//   // });
//   console.log("a user connected :D");
//   socket.on("chat message", (msg) => {
//     console.log("hi메세지 "+msg);
//     io.emit("chat message", msg);
//   });
// })


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
