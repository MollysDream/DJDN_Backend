const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const advertisement_Schema=mongoose.Schema;

const advertisementSchema=new advertisement_Schema({

    active:{
        type:Boolean,
        default:true,
        required: true
    },
    title:{
        type:String,
        required:true
    },

    image:[{
        type:String,
        required: false
    }],
    
    text:{
        type:String,
        required: false
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    count:{
        type:Number,
        required:true,
        default:0
    },
    shopOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'shopOwner'
    },
    latitude:{
        type:String,
    },
    longitude:{
        type:String,
    },
    addressName:{
        type:String,
    },
    location: {
        type:{type:String, default: 'Point'},
        coordinates:{type:[Number]}
        },
})

// advertisementSchema.plugin(mongooseAutoInc.plugin, 'advertisement');
// mongooseAutoInc.initialize(mongoose.connection);
// advertisementSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'advertisementSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('advertisement',advertisementSchema);
