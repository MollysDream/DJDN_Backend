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
 
// categorySchema.plugin(mongooseAutoInc.plugin, 'category');
categorySchema.plugin(mongooseAutoInc.plugin, {
    model: 'categorySchema',
    field: 'categorySchema_id',
    startAt: 1,
    incrementBy: 1
});
module.exports = mongoose.model('category',categorySchema);


