const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const advertisement_Schema=mongoose.Schema;
const user = require('./user');

const advertisementSchema=new advertisement_Schema({

    approve:{
        type:Boolean,
        default:false,
        required: true
    },
    active:{
        type:Boolean,
        default:false,
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
        required:false,
        default:0
    },
    phoneNumber:{
        type:String,
        required:false,
        default:null
    },
    count:{
        type:Number,
        required:true,
        default:0
    },
    shopOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
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
    radius:{
        type:Number,
        default: 500
    },
    date:{
        type:Date,
        default:Date.now,
        required: true
    },
    endDate:{
        type:Date,
    }
})

advertisementSchema.index({location:'2dsphere'});

// advertisementSchema.plugin(mongooseAutoInc.plugin, 'advertisement');
// mongooseAutoInc.initialize(mongoose.connection);
// advertisementSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'advertisementSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('advertisement',advertisementSchema);
