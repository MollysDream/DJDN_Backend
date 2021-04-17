const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const trade_Schema=mongoose.Schema;

const tradeSchema=new trade_Schema({
    startTime:{
        type:Date,
        default:Date.now,
        required:true
    },
    endTime:{
        type:Date,
        default:Date.now,
        required:true
    },
    workTime:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        required:true
    },
    userList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
})

tradeSchema.plugin(mongooseAutoInc.plugin, 'trade');
module.exports = mongoose.model('trade',tradeSchema);