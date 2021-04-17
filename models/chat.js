const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const chat_Schema=mongoose.Schema;

const chatSchema=new chat_Schema({
    content:[{
        image: {
            type:String
        },
        text:{
            type:String
        }
    }],
    timeStamp:[{
        type:Date,
        default:Date.now,
    }],
    userList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    chatRoom:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'chatRoom'}
})

chatSchema.plugin(mongooseAutoInc.plugin, 'chat');
module.exports = mongoose.model('chat',chatSchema);