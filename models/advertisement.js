const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const advertisement_Schema=mongoose.Schema;

const advertisementSchema=new advertisement_Schema({

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
    }],
    shopOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'shopOwner'
    }
})

// advertisementSchema.plugin(mongooseAutoInc.plugin, 'advertisement');
mongooseAutoInc.initialize(mongoose.connection);
advertisementSchema.plugin(mongooseAutoInc.plugin, {
    model: 'advertisementSchema',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('advertisement',advertisementSchema);
