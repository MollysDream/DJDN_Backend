const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const admin_Schema=mongoose.Schema;

const adminSchema=new admin_Schema({

    user_id:{
        type:String,
        required: true
    },
    firebaseFCM:{
        type:String
    },
})

// adminSchema.plugin(mongooseAutoInc.plugin, 'admin');
// mongooseAutoInc.initialize(mongoose.connection);
// adminSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'adminSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });

module.exports = mongoose.model('admin',adminSchema);
