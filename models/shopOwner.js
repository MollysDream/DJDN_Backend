const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const shopOwner_Schema=mongoose.Schema;

const shopOwnerSchema=new shopOwner_Schema({
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
    shopName:[{
        type:String,
        required: true
    }],
    point:{
        type:Number,
        required: true
    },
    advertisementList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'advertisement'
    }]
})

shopOwnerSchema.plugin(mongooseAutoInc.plugin, 'shopOwner');
module.exports = mongoose.model('shopOwner',shopOwnerSchema);