const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const chatRoom_Schema=mongoose.Schema;

const chatRoomSchema=new chatRoom_Schema({
    // userList:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref: 'user'
    // }],


    hostId:{type:String},
    postOwner:{type:String},
    postId:{type:String}

})

// chatRoomSchema.plugin(mongooseAutoInc.plugin, 'chatRoom');
// mongooseAutoInc.initialize(mongoose.connection);
// chatRoomSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'chatRoomSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });

module.exports = mongoose.model('chatRoom',chatRoomSchema);
