const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const user_Schema=mongoose.Schema;

const userSchema=new user_Schema({
    nickName:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    profileImage:{
        type:String,
        required: true
    },
    averageRating:{
        type:Number,
        required: true
    },
    ban:{
        type:Boolean,
        required:true
    },
    addressList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'address'
    }],
    postList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    keyword:{
        type:String
    },
    tradeList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'trade'
    }],
})

userSchema.plugin(mongooseAutoInc.plugin, 'user');
module.exports = mongoose.model('user',userSchema);