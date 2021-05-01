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
    //채팅 각각의 시간
    timeStamp:[{
        type:Date,
        default:Date.now,
    }],
    chatRoom:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'chatRoom'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

// chatSchema.plugin(mongooseAutoInc.plugin, 'chat');
chatSchema.plugin(mongooseAutoInc.plugin, {
    model: 'chatSchema',
    field: 'chatSchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('chat',chatSchema);
