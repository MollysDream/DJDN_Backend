const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const category_Schema=mongoose.Schema;

//게시물 Schema
const categorySchema=new category_Schema({

    category:[{
        type:Object,
        required: true
    }]

})

categorySchema.plugin(mongooseAutoInc.plugin, 'category');
module.exports = mongoose.model('category',categorySchema);

