const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const post_Schema=mongoose.Schema;

//게시물 Schema

const postSchema=new post_Schema({
    title:{
        type:String,
        required: true
    },
    image:[{
        type:String,
        required: false
    }],
    text:{
        type:String,
        required: false
    },
    price:{
        type:Number,
        required: true,
        default: 0
    },
    category:[{
        type:String,
        required: true
    }],
    //조회수
    view:{
        type:Number,
        default:0,
        required: true
    },
    //게시날짜
    date:{
        type:Date,
        default:Date.now,
        required: true
    },
    latitude:{
        type:String,
    },
    longitude:{
        type:String,
    },
    location: {
        type:{type:String, default: 'Point'},
        coordinates:{type:[Number]}
        },
    // ~~동 ex) 우만동, 원천동
    addressName:{
        type:String,
    },
    user_id:{
        type:String,
        required: true
    },
    tradeStatus:{   //0:아무일 없음, 1:거래중, 2:거래완료
        type:Number,
        default:0
    }

})

postSchema.index({location:'2dsphere'/*, title:'text', text:'text'*/});

// postSchema.plugin(mongooseAutoInc.plugin, 'post');
// mongooseAutoInc.initialize(mongoose.connection);
// postSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'postSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('post',postSchema);

