const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const user_Schema=mongoose.Schema;

const userSchema=new user_Schema({
    nickname:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    }
    /*email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    profile_image:{
        type:String,
        required: true
    }*/
    /*average_rating:{
        type:Float32Array,
        required: true
    }*/


})

userSchema.plugin(mongooseAutoInc.plugin, 'user');
module.exports = mongoose.model('user',userSchema);