const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const post_Schema=mongoose.Schema;

//게시물 Schema

const postSchema=new post_Schema({
    title:{
        type:String,
        required: true
    },
    content:{
        image:{
            type:String,
            required: false
        },
        text:{
            type:String,
            required: false
        }
    },
    category:[{
        type:String,
        required: true
    }],
    tag:[{
        type:String,
        required: true
    }],
    view:{
        type:Number,
        required: true
    },
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

postSchema.plugin(mongooseAutoInc.plugin, 'post');
module.exports = mongoose.model('post',postSchema);