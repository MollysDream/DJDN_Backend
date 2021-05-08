const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const chat_Schema=mongoose.Schema;

const chatSchema=new chat_Schema({
    beforeTime: {type:String},
    textId : {type:String},
    createdAt : {type:String},
    text : {type:String},
    senderId : {type:String},
    roomId : {type:String},
})

// chatSchema.plugin(mongooseAutoInc.plugin, 'chat');
// mongooseAutoInc.initialize(mongoose.connection);
// chatSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'chatSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('chat',chatSchema);
