const mongoose =require('mongoose');

const point_Schema=mongoose.Schema;

//게시물 Schema

const pointSchema=new point_Schema({

    //광고 포인트
    point:{
        type:Number,
        default:0,
        required: true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
    }

})


module.exports = mongoose.model('point',pointSchema);

