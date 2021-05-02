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
    //거래장소
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
    }],
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
})

// tradeSchema.plugin(mongooseAutoInc.plugin, 'trade');
mongooseAutoInc.initialize(mongoose.connection);
tradeSchema.plugin(mongooseAutoInc.plugin, {
    model: 'tradeSchema',
    field: 'tradeSchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('trade',tradeSchema);
