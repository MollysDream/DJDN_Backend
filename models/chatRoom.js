const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const chatRoom_Schema=mongoose.Schema;

const chatRoomSchema=new chatRoom_Schema({
    userList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    // 하나의 게시물에 연결
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
})

// chatRoomSchema.plugin(mongooseAutoInc.plugin, 'chatRoom');
mongooseAutoInc.initialize(mongoose.connection);
chatRoomSchema.plugin(mongooseAutoInc.plugin, {
    model: 'chatRoomSchema',
    field: 'chatRoomSchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('chatRoom',chatRoomSchema);
