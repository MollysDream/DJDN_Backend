const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const post_Schema=mongoose.Schema;

const postSchema=new post_Schema({
    title:{
        type:String,
        required: true
    },
    content:{
       image:[{
           type:String,
           required: false
       }],
        text:{
            type:String,
            required: false
        }
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

postSchema.plugin(mongooseAutoInc.plugin, 'post');
module.exports = mongoose.model('post',postSchema);
