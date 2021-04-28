const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const autoReport_Schema=mongoose.Schema;

const autoReportSchema=new autoReport_Schema({
   trade:{
       type:mongoose.Schema.Types.ObjectId,
       ref: 'trade'
   }
})

autoReportSchema.plugin(mongooseAutoInc.plugin, 'autoReport');
module.exports = mongoose.model('autoReport',autoReportSchema);