const mongoose = require('mongoose');
const assert = require('assert');
const Post = require("../models/post");
const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)


describe('Drop all collections before each test',()=>{
    it('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.posts.drop(()=>{
            done();
        });
    });
});


describe('Create a Post instance', ()=>{
    it('Saves a record to the DB',()=>{

        let samplePost = new Post({
            title : "몰리 산책시키기",
            price : 123,
            category : ['애완동물'],
            tag : ['몰리','산책','귀여움','사나움'],
            view : 3,
            date : Date.now()
        });
        samplePost.save().then(()=>{
            assert(samplePost.isNew === false);
            done();
        });
    });
});


describe('GET /getPost',()=>{
   it('Ok, fine',(done)=>{
       request(app)
           .get('/data/getPost')
           .expect(200)
           .then((res)=>{
               const body = res.body;
               console.log(body);
               expect(body.length).to.equal(1);
               done();
       })
           .catch((err)=> done(err));
    }) ;
});


describe('GET /getPostBySearch',()=>{
    it('Ok, fine',(done)=>{
        request(app).get('/data/getPostBySearch')
            .send('몰리 산책시키기')
            .then((res)=>{
                const body = res.body;
                console.log(body);
                expect(body.length).to.equal(1);
                done();
            })
            .catch((err)=> done(err));
    }) ;
});


describe('Post /createPost',()=>{
    it('Ok, fine',(done)=>{
        request(app).post('/data/createPost')
            .send({   title : "몰리 산책시키기22",
                price : 123,
                category : ['애완동물'],
                tag : ['몰리','산책','귀여움','사나움'],
                view : 3,
                date : Date.now() })
            .expect(200)
            // .expect({ title: "몰리 산책시키기22" })
            .then((res)=>{
                const body = res.body;
                console.log(body);
                expect(body.title).equal("몰리 산책시키기22");
                done();
            })
            .catch((err)=> done(err));
    }) ;
});


