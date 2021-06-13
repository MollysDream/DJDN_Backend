const mongoose = require('mongoose');
const assert = require('assert');
const Trade = require("../models/trade");
const Post = require("../models/post");
const User = require("../models/user");
const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)


describe.skip('Drop all collections before each test',()=>{
    it('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.trades.drop(()=>{
        });
        mongoose.connection.collections.users.drop(()=>{
            done();
        });
    });
});


// ++ 테스트용 User 2명이상, Post 1개 이상 생성할것
describe('Create a Trade instance , 2 User instances , and 1 Post instance', ()=>{

    var userId1 = mongoose.Types.ObjectId().toString();
    let userId2 = mongoose.Types.ObjectId().toString();
    let postId = mongoose.Types.ObjectId().toString();


    console.log(userId1 +"   " +typeof userId1);

    it('Saves 2 users to the DB', ()=>{
        request(app).post('/member/join')
          .send({
              _id: userId1,
              email: 'user1@ajou.ac.kr',
              password: 'qwerty1234@@',
              name: 'user1',
              nickname: 'user1'
          })
          .then((res)=>{
              userId1 = res._id;
              console.log(res._id);
              done();
          })
          .catch((err)=> done(err));

        request(app).post('/member/join')
          .send({
              _id: userId2,
              email: 'user2@ajou.ac.kr',
              password: 'qwerty1234@@',
              name: 'user2',
              nickname: 'user2'
          })
          .then((res)=>{
              console.log(res);
              done();
          })
          .catch((err)=> done(err));
    })

  it.skip('Saves a post to the DB',()=>{
    let samplePost = new Post({
      _id: postId,
      title : "post1",
      price : 12345,
      category : ['애완동물'],
      tag : ['몰리','산책','귀여움','사나움'],
      view : 6,
      date : Date.now()
    });
    samplePost.save().then(()=>{
      assert(samplePost.isNew === false);
      console.log(samplePost);
      done();
    });
  });



    it('Saves a trade to the DB',()=>{
        let post =  Post.findOne({title:'post1'}).then((data)=>{
          return data._id
        });
        console.log(post);

        let sampleTrade = new Trade({
            startTime : Date.now(),
            endTime:Date.now(),
            workTime:'22',
            location: "경기도 수원시 영통구 중부대로271번길, 27-9 104-1402",
            complete: false,
            userList:[userId1, `${userId2}`],
            post:'60938df57ff84e3f14cf8a59'
            // post: post
        });

        console.log(userId1);
        sampleTrade.save().then(()=>{
            assert(sampleTrade.isNew === false);
            expect(sampleTrade)
            done();
        });
    });
});


describe('GET /getTrade',()=>{
    it('Ok, fine',(done)=>{
        request(app).get('/trade/getTrade')
            .then((res)=>{
                const body = res.body;
                console.log(body);
                // expect(body.userList).to.equal(1);
                done();
            })
            .catch((err)=> done(err));
    }) ;
});

describe('POST /updateTradeTime',()=>{
  it('Ok, fine',(done)=>{
    request(app).get('/trade/getTrade')
      .send()
      .then((res)=>{
        const body = res.body;
        console.log(body);
        // expect(body.userList).to.equal(1);
        done();
      })
      .catch((err)=> done(err));
  }) ;
});


