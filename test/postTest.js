const mongoose = require('mongoose');
const assert = require('assert');
const Post = require("../models/post");
const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)

// Create Post instance
describe('Saving records', ()=>{

    // Drop all collections before each test
    beforeEach('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.posts.drop(()=>{
            done();
        });

    })

    it('Saves a record to the DB',()=>{

        let samplePost = new Post({
            title : "Lord Of The Rings",
            price : 123,
            category : ['오잉'],
            tag : ['에잉'],
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
       request(app).get('/data/getPost')
           .then((res)=>{
               const body = res.body;
               console.log(body);
               expect(body.length).to.equal(1);
               done();
       })
           .catch((err)=> done(err));
    }) ;

});
