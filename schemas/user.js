const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  average_rating: {
    type: Number,
    required: false
  },
  ban: {
    type:Boolean,
    default:false
  },
  // address_list: {
  //   type: ObjectId,
  //   ref : Address
  // },
  profile_image: {
    type:String
  },
  keyword :{
    type: String
  },
  salt: {
    type: String,
    required: true
  },

});

module.exports = mongoose.model("User", userSchema);