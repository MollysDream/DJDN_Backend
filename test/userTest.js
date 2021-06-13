const mongoose = require('mongoose');
const assert = require('assert');
const Trade = require("../models/trade");
const User = require('../models/user');
const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)


describe.skip('Drop all collections before each test',()=>{
    it('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.users.drop(()=>{
            done();
        });
    });
});


describe('Test for login', ()=>{

    let userId;

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
           userId = res._id;
            // console.log(sampleTrade);
            done();
        });
    });
    it('Login Ok, fine',(done)=>{
      request(app).post('/member/login')
        .send({
          email: 'mochaTestUser@ajou.ac.kr',
          password: 'qwerty1234@@'
        })
        .then((res)=>{
          console.log("로그인 확인");
          expect(res.body.user_id).to.equal(userId);
          done();
        })
        .catch((err)=> done(err));
    }) ;

    it('생성한 데이터 삭제',(done)=>{
      mongoose.connection.collections.users.deleteOne({email:'mochaTestUser@ajou.ac.kr' })
        .then(()=>{
          done();
        });
    });

});

// 회원가입 테스트
describe('Test for POST /join',()=>{

    let userId;
    let email ='mochaTest@ajou.ac.kr';
    let name;

    it('회원가입 확인',(done)=>{
        request(app).post('/member/join')
            .send({
                email: 'mochaTest@ajou.ac.kr',
                password: 'qwerty1234@@',
                name: 'mochaTest',
                nickname: 'mochaTest'
            })
            .then((res)=>{
                // console.log(userId);
                // expect(name).equal("mochaTest");
                done();
            })
            .catch((err)=> done(err));


        request(app).post('/point/createPoint')
          .send({
            email: email
          }).then((res)=>{
            console.log("무야호!!"+res.data);
            expect(res.data).equal(0)
        })
    }) ;

    it('Point 생성 확인',(done)=>{

        request(app).get('/point/getPointById')
          .then((res)=>{
              console.log(userId)
              expect(res.user_id).equal(userId);
              // expect(res.point).equal(0);
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

describe('사용자 평가 테스트',()=>{
  it('사용자 평가 테스트',(done)=>{
    request(app).post('/trade/userRate')
      .send({
        userId:"60c5a52cca12c958f8a3e04d" ,
        rate: 3.7
      })
      .then((res)=>{
        // console.log(res.message);
        done();
      })
      .catch((err)=> done(err));
  });
});




