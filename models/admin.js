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

// adminSchema.plugin(mongooseAutoInc.plugin, 'admin');
mongooseAutoInc.initialize(mongoose.connection);
adminSchema.plugin(mongooseAutoInc.plugin, {
    model: 'adminSchema',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('admin',adminSchema);
