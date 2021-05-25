const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const report_Schema=mongoose.Schema;
const user = require('./user');
const post = require('./post');

const reportSchema=new report_Schema({
    reportUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    targetUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    targetPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    reportWhat:{ // 0->게시글  1->사용자
        type:Number
    },
    //신고 종류 ex.불법재능, 사기
    reportCategory:{
        type:String,
    },
    //신고내용
    text:{
        type:String,
        required:false,
    },
    date:{
        type:Date,
        default:Date.now,
        required: true
    },
    done:{
        type:Boolean,
        default:false,
    }
})

// reportSchema.plugin(mongooseAutoInc.plugin, 'report');
// mongooseAutoInc.initialize(mongoose.connection);
// reportSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'reportSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('report',reportSchema);
