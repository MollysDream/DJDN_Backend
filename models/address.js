const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const address_Schema=mongoose.Schema;

const addressSchema=new address_Schema({
    isAuth:{
        type:Boolean,
        required:true
    },
    //넓은범위주소, ex)우만동, 원천동
    addressName:{
        type:String,
        required:true
    },
    //상세주소
    detailLocation:{
        type:String,
        required:true
    },
    latitude:{
        type:String,
        required:true
    },
    longitude:{
        type:String,
        required:true
    }
})

addressSchema.plugin(mongooseAutoInc.plugin, 'address');
module.exports = mongoose.model('address',addressSchema);