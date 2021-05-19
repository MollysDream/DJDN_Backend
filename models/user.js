const mongoose =require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const user_Schema=mongoose.Schema;

const userSchema=new user_Schema({

    nickname:{
        type:String,
        required: true
    },
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
    },
    profileImage:{
        type:String,
    },
    averageRating:{
        type:Number,
        default:3
    },
    ban:{
        type:Boolean,
    },
    keyword:[{
        type:String
    }],
    // 비밀번호 암호화
    salt:{
        type:String,
        required: true
    },
    category: {
        type:Array,
        required: true,
        default:['조립','수리','운반','퇴치','설치','청소','과외','디자인','제작']
    },
    sort:{
        type:Number,   //최신순: 0, 거리순: 1
        required: false,
        default:0
    },
    addressIndex:{
        type:Number
    },
    profileImage:{
        type:String,
        default:'https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/default-image.jpg'
    },
    keyword:[{
        type:String,
        default:[]
    }
    ]


})

// userSchema.plugin(mongooseAutoInc.plugin, 'user');
// mongooseAutoInc.initialize(mongoose.connection);
// userSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'userSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('user',userSchema);
