const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const report_Schema=mongoose.Schema;

const reportSchema=new report_Schema({
    reportUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    targetUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    targetPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    //신고유형
    reportType:[{
        type:String,
    }],
    //신고내용
    description:{
        type:String,
        required:false,
    }
})

// reportSchema.plugin(mongooseAutoInc.plugin, 'report');
mongooseAutoInc.initialize(mongoose.connection);
reportSchema.plugin(mongooseAutoInc.plugin, {
    model: 'reportSchema',
    field: 'reportSchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('report',reportSchema);
