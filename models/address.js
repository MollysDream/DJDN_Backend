const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');
const user = require('./user');

const address_Schema=mongoose.Schema;

const addressSchema=new address_Schema({
    isAuth:{
        type:Boolean,
        default:false
    },
    //넓은범위주소, ex)우만동, 원천동
    addressName:{
        type:String,
        required:true
    },
    // //상세주소
    // detailLocation:{
    //     type:String,
    //     required:true
    // },
    latitude:{
        type:String,
        required:false
    },
    longitude:{
        type:String,
        required:false
    },
    radius:{
        type:Number,
        default: 500
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    addressIndex:{
        type:Number
    }
})

// mongooseAutoInc.initialize(mongoose.connection);
// addressSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'addressSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });

module.exports = mongoose.model('address',addressSchema);
