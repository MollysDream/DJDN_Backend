const mongoose =require('mongoose');

const certificate_Schema=mongoose.Schema;

//카테고리 Schema
const certificateSchema=new certificate_Schema({

    title:{
        type:String,
        required: true
    },
    text:{
        type:String,
        required:true
    },
    certificateImage:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required: true
    },

})


module.exports = mongoose.model('certificate',certificateSchema);


