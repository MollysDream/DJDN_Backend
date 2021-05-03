const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const review_Schema=mongoose.Schema;

const reviewSchema=new review_Schema({
    reviewUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    targetUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    trade:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'trade'
    },
    rating:{
        type:Number,
        default:3,
        required:false,
    }
})

// reviewSchema.plugin(mongooseAutoInc.plugin, 'review');
mongooseAutoInc.initialize(mongoose.connection);
reviewSchema.plugin(mongooseAutoInc.plugin, {
    model: 'reviewSchema',
    field: 'reviewSchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('review',reviewSchema);
