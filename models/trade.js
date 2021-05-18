const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const trade_Schema=mongoose.Schema;


const tradeSchema=new trade_Schema({

    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    // workTime:{
    //     type:Number,
    //     required:true
    // },
    // 자동신고가 가능하게 자세히 ...
    // 거래장소 ex) 경기도 수원시 영통구 중부대로271번길, 27-9 104-1402
    location:{
        type:String,
        required:true
    },
    isSave:{
        type:Boolean,
        required:true
    },
    complete:{
        type:Boolean,
        required:true
    },
    sender:{
        type:String
    },
    receiver:{
        type:String
    },
    chatRoom:{
        type:String
    }
})

// tradeSchema.plugin(mongooseAutoInc.plugin, 'trade');
// mongooseAutoInc.initialize(mongoose.connection);
// tradeSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'tradeSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('trade',tradeSchema);