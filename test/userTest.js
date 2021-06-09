const mongoose = require('mongoose');
const assert = require('assert');
const Trade = require("../models/trade");
const User = require('../models/user');
const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)


describe('Drop all collections before each test',()=>{
    it('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.users.drop(()=>{
            done();
        });
    });
});


describe('Create a User instance', ()=>{
    it('Saves a user to the DB',()=>{
        let sampleTrade = new User({
            nickname:'mochaTestUser',
            name:'mochaTestUser',
            email:'mochaTestUser@ajou.ac.kr',
            password:'qwerty1234@@',
            category:['조립','수리','운반','퇴치','설치','청소','과외','디자인','제작'],
        });
        sampleTrade.save().then(()=>{
            assert(sampleTrade.isNew === false);
            // console.log(sampleTrade);
            done();
        });
    });
});

// 회원가입 테스트
describe('Test for POST /join',()=>{

    let userId;

    it('회원가입 확인',(done)=>{
        request(app).post('/member/join')
            .send({
                email: 'mochaTest@ajou.ac.kr',
                password: 'qwerty1234@@',
                name: 'mochaTest',
                nickname: 'mochaTest'
            })
            .then((res)=>{
                userId = res._id;
                console.log(res.name);
                expect(res.name).equal("mochaTest");
                done();
            })
            .catch((err)=> done(err));
    }) ;

    it('Point 생성 확인',(done)=>{

        request(app).get('/point/getPointById')
          .then((res)=>{
              expect(res.user_id).equal(userId);
              expect(res.point).equal(0);
              done();
          })
          .catch((err)=> done(err));
    });

    it('생성한 데이터 삭제',(done)=>{

        mongoose.connection.collections.users.deleteOne({_id: userId})
          .then(()=>{
              done();
          });

    });

});

// 로그인 테스트
describe('Test for POST /login',()=>{
    it('Login Ok, fine',(done)=>{
        request(app).post('/member/login')
            .send({
                email: 'user1@ajou.ac.kr',
                password: 'qwerty1234@@'
            })
            .then((res)=>{
                // const body = res.body;
                // console.log(body);
                console.log('test 출력! '+ res.body.email);
                // console.log(res.json);
                // expect(body.length).to.equal(1);
                done();
            })
            .catch((err)=> done(err));
    }) ;
});

// describe.skip('Post /createPost',()=>{
//     it('Ok, fine',(done)=>{
//         request(app).post('/data/createPost')
//             .send({   title : "몰리 산책시키기22",
//                 price : 123,
//                 category : ['애완동물'],
//                 tag : ['몰리','산책','귀여움','사나움'],
//                 view : 3,
//                 date : Date.now() })
//             .expect(200)
//             // .expect({ title: "몰리 산책시키기22" })
//             .then((res)=>{
//                 const body = res.body;
//                 console.log(body);
//                 expect(body.title).equal("몰리 산책시키기22");
//                 done();
//             })
//             .catch((err)=> done(err));
//     }) ;
// });



