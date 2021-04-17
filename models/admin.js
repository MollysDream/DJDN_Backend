const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const admin_Schema=mongoose.Schema;

const adminSchema=new admin_Schema({
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
    }
})

adminSchema.plugin(mongooseAutoInc.plugin, 'admin');
module.exports = mongoose.model('admin',adminSchema);