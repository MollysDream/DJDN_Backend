const mongoose = require('mongoose');
const assert = require('assert');
const Post = require("../models/post");
const User = require("../models/user");

const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)

let userId;
let email = 'mochaTest@ajou.ac.kr';
let rating;
let name;
let averageRating;

describe.skip('Drop all collections before each test',()=>{
    it('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.posts.drop(()=>{
            done();
        });
    });
});


describe('샘플 사용자 생성',()=>{


  it('샘플 사용자 생성 확인',()=>{
    let sampleUser = new User({
      rating:3,
      ratingCount:1,
      ban:false,
      bandDate:null,
      category:['조립','수리','운반','퇴치','설치','청소','과외','디자인','제작'],
      sort:0,
      profileImage:"a",
      keyword:[],
      email:"sample2",
      name:"sample1",
      nickname:"sample1",
      password:"sample1",
      salt:"sample1",
      phoneNumber:"01012345678",
      averageRating:3,
      __v:0,
      _id:"1"
    });
    sampleUser.save().then(()=>{
      assert(sampleUser.isNew === false);
      done();
    });
  });

  it('게시글 조회 확인',(done)=>{

    console.log("name",userId);
    request(app).get('/data/getPost')
      .send(userId)
      .then((res)=>{
        // let body = res.body;
        // console.log(body);
        expect(200);
        done();
      })
      .catch((err)=> done(err));
  }) ;
});


describe('샘플 게시글 생성', ()=>{
    it('샘플 게시글 생성 확인',()=>{
        let samplePost = new Post({
            title : "몰리 산책시키기",
            price : 123,
            category : ['애완동물'],
            tag : ['몰리','산책','귀여움','사나움'],
            view : 3,
            date : Date.now(),
            user_id: userId
        });
        samplePost.save().then(()=>{
            assert(samplePost.isNew === false);
            done();
        });
    });
});


describe('게시글 조회 테스트',()=>{
   it('게시글 조회 확인',(done)=>{
       request(app)
           .get('/data/getPost')
         .send({page:1, userId:userId})
           .expect(200)
           .then((res)=>{
               let body = res.body;
               console.log(body);
               expect(200);
               done();
       })
           .catch((err)=> done(err));
    }) ;
});


describe('게시글 검색 테스트',()=>{
    it('게시글 검색 확인',(done)=>{
        request(app).get('/data/getPostBySearch')
            .send({searchValue:'몰리',userId:userId})
            .then((res)=>{
                const body = res.body;
                console.log(body);
              expect(200);
              done();
            })
            .catch((err)=> done(err));
    }) ;
});


describe('게시글 생성 테스트',()=>{
    it('게시글 생성 확인',(done)=>{
        request(app).post('/data/createPost')
            .send({
                title : "몰리 산책시키기22",
                image : 'url',
                text : '몰리 산책시키기입니다. 연락주세요.',
                price : 123,
                category : ['애완동물'],
                tag : ['몰리','산책','귀여움','사나움'],
                view : 3,
                date : Date.now(),
                user_id: '60c5a52cca12c958f8a3e04d',
                latitude: '100',
                longitude: '200',
                addressName: '우만동',
            })
            // .expect({ title: "몰리 산책시키기22" })
            .then((res)=>{
                const body = res.body;
                console.log(body);
              expect(200);
              done();
            })
            .catch((err)=> done(err));
    }) ;
});


