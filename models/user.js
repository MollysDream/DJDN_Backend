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
    phoneNumber:{
        type:String,
        // required: true
    },
    rating:{
        type:Number,
        default:3
    },
    ratingCount:{
        type:Number,
        default:1
    },
    averageRating:{
        type:Number
    },
    firebaseFCM:{
        type:String
    },
    ban:{
        type:Boolean,
        default:false
    },
    banDate:{
        type:Date,
        default:null
    },
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
        type:Number,   //최신순: 0, 거리순: 1, 키워드: 2
        required: false,
        default:0
    },
    addressIndex:{
        type:Number
    },
    profileImage:{
        type:String,
        default:'https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/---%ED%94%84%EB%A1%9C%ED%95%84+%EC%9D%B4%EB%AF%B8%EC%A7%80---/DefaultImage/default-image.jpg'
    },
    keyword:[{
        type:String,
        default:[]
    }
    ]

})

userSchema
.pre('save', function(next){
  this.averageRating = this.rating/this.ratingCount
  next();
});

userSchema
.pre('update', function(next){
  console.log("업데이트 확인")
  const update = this.getUpdate();
  console.log("업데이트된 점수 확인 "+update.$inc.rating);
  this.update({},{averageRating: update.$inc.rating/update.$inc.ratingCount});

  next();
});

// userSchema.plugin(mongooseAutoInc.plugin, 'user');
// mongooseAutoInc.initialize(mongoose.connection);
// userSchema.plugin(mongooseAutoInc.plugin, {
//     model: 'userSchema',
//     field: '_id',
//     startAt: 1,
//     incrementBy: 1
// });
module.exports = mongoose.model('user',userSchema);
