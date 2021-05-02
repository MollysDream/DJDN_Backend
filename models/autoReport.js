const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const autoReport_Schema=mongoose.Schema;

const autoReportSchema=new autoReport_Schema({
   trade:{
       type:mongoose.Schema.Types.ObjectId,
       ref: 'trade'
   }
})

// autoReportSchema.plugin(mongooseAutoInc.plugin, 'autoReport');
mongooseAutoInc.initialize(mongoose.connection);
autoReportSchema.plugin(mongooseAutoInc.plugin, {
    model: 'autoReportSchema',
    field: 'autoReportSchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('autoReport',autoReportSchema);
