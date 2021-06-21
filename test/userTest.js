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
        // Drop the User collection
        mongoose.connection.collections.users.drop(()=>{
            done();
        });
    });
});

//로그인 테스트
describe('로그인 테스트', ()=>{
    let userId;
    it('샘플 사용자 생성',()=>{
        request(app).post('/member/join')
          .send({
            email: 'mochaTest@ajou.ac.kr',
            password: 'qwerty1234@@',
            name: 'mochaTest',
            nickname: 'mochaTest',
            phoneNumber: '01012345678'

          })
          .then((res)=>{
            // expect(name).equal("mochaTest");
            done();
          })
          .catch((err)=> done(err));
    });
    it('로그인 확인',(done)=>{
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

    it('생성 데이터 삭제',(done)=>{
      mongoose.connection.collections.users.deleteOne({email:'mochaTestUser@ajou.ac.kr' })
        .then(()=>{
          done();
        });
    });

});

// 회원가입 테스트
describe('회원가입 테스트',()=>{
    let userId;
    let email ='mochaTest@ajou.ac.kr';
    let name;
    let nickname;
    let phoneNumber;

    it('회원가입 확인',(done)=>{
        request(app).post('/member/join')
            .send({
                email: 'mochaTest@ajou.ac.kr',
                password: 'qwerty1234@@',
                name: 'mochaTest',
                nickname: 'mochaTest',
                phoneNumber: '01012345678'
            })
            .then((res)=>{
                // expect(name).equal("mochaTest");
              mongoose.connection.collections.users.findOne({email: email})
                .then((res)=>{
                  userId=res._id;
                  email=res.email;
                  name=res.name;
                  phoneNumber=res.phoneNumber;
                  nickname =res.nickname;
                  console.log("sdfasf!!",userId);
                });
            })
            .then(()=>{
              done();
            })
            .catch((err)=> done(err));
        // request(app).post('/point/createPoint')
        //   .send({
        //     email: email
        //   })
        //   .then((res)=>{
        //     // console.log("무야호!!"+res.data);
        //     // expect(res.data).equal(0)
        //     done();
        //   });

    }) ;
    it('사용자 이름 확인',(done)=>{
      console.log(name);
      expect(name).equal('mochaTest')
      done();
    })
    it('사용자 email 확인',(done)=>{
      console.log(email);
      expect(email).equal('mochaTest@ajou.ac.kr')
      done();

    })
    it('사용자 닉네임 확인',(done)=>{
      console.log(nickname);
      expect(nickname).equal('mochaTest')
      done();

    })
    it('사용자 phoneNumber 확인',(done)=>{
      console.log(phoneNumber);
      expect(phoneNumber).to.equal('01012345678')
      done();
    })


    it('Point 생성 확인',(done)=>{
      let vv;
      let point;
      mongoose.connection.collections.users.findOne({email: email})
        .then((res)=>{
          vv=res._id;
          // console.log("vv",vv);
          request(app).get('/point/getPointById')
            .send({
              userId: vv
            })
            .then((res)=>{
              // expect(res.point).equal(0);
              // console.log("dfdfdfdzfzf "+res.body.point);
              done();
            })
            .catch((err)=> done(err));
        })

      mongoose.connection.collections.points.findOne({user_id: vv})
        .then((res)=>{
          point = res.point;
          console.log("뽀인트 확인!"+point);
          expect(res.point).to.equal(0);
        })
      // console.log(userId);
    });

    it('생성 데이터 삭제',(done)=>{
      console.log(email)
      mongoose.connection.collections.users.deleteOne({email: email})
          .then(()=>{

              done();
          });
    });
});

describe('사용자 평가 테스트',()=>{
  let userId;
  let email = 'mochaTest@ajou.ac.kr';
  let rating;
  let name;
  let averageRating;
  it('샘플 사용자 생성',()=>{
    request(app).post('/member/join')
      .send({
        email: 'mochaTest@ajou.ac.kr',
        password: 'qwerty1234@@',
        name: 'mochaTest',
        nickname: 'mochaTest',
        phoneNumber: '01012345678'

      })
      .then((res)=>{
        console.log(res);
        expect(res.name).equal("mochaTest");
        done();
      })
      .catch((err)=> done(err));

    mongoose.connection.collections.users.findOne({email: email})
      .then((res)=>{
        userId=res._id;
        email=res.email;
        name=res.name;
        rating=res.rating;
        averageRating=res.averageRating;
      })

    console.log(email)
  });

  it('사용자 평가 확인',(done)=>{
    request(app).post('/trade/userRate')
      .send({
        userId:userId ,
        rate: 5.0
      })
      .then((res)=> {
      done();
      })
      .catch((err)=> done(err));


    mongoose.connection.collections.users.findOne({email: email})
      .then((res)=>{
        expect(res.averageRating).to.equal(4)
      })
  });


  it('생성 데이터 삭제',(done)=>{
    console.log(email)
    mongoose.connection.collections.users.deleteOne({email: email})
      .then(()=>{
        done();
      });
  });
});




