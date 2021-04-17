const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const advertisement_Schema=mongoose.Schema;

const advertisementSchema=new advertisement_Schema({
    shopOwner:{
        type:String,
        required: true
    },
    active:{
        type:Boolean,
        default:true,
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
    duration:{
        type:String,
        required:true
    },
    //광고 노출 동네
    area:[{
        addressName:{
            type:String,
            required:true
        }
    }]
})

advertisementSchema.plugin(mongooseAutoInc.plugin, 'advertisement');
module.exports = mongoose.model('advertisement',advertisementSchema);