const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const category_Schema=mongoose.Schema;

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

    //게시물에 붙이는 태그
    tag:[{
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
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'chatRoom'
    }

})

postSchema.index({title:'text', content:'text'});

// postSchema.plugin(mongooseAutoInc.plugin, 'post');
postSchema.plugin(mongooseAutoInc.plugin, {
    model: 'postSchema',
    field: 'postSchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('post',postSchema);

