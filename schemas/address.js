const mongoose = require("mongoose");

const { Schema } = mongoose;
const addressSchema = new Schema({
  isAuth:{
      type:Boolean,
      default:false
  },
  addressName:{
      type:String,
      required:true
  },
  latitude:{
      type:Number,
      required:true
  },
  longitude:{
      type:Number,
      required:true
  },
  user_id: {
      type: ObjectId,
      ref : "User"
    },
});

module.exports = mongoose.model("Address", addressSchema);