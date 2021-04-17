const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const address_Schema=mongoose.Schema;

const addressSchema=new address_Schema({
    isAuth:{
        type:Boolean,
        required:true
    },
    addressName:{
        type:String,
        required:true
    },
    location:{
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