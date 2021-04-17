const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const chatRoom_Schema=mongoose.Schema;

const chatRoomSchema=new chatRoom_Schema({
    userList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    postList:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
})

chatRoomSchema.plugin(mongooseAutoInc.plugin, 'chatRoom');
module.exports = mongoose.model('chatRoom',chatRoomSchema);