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
            nickname:'대장 강아지',
            name:'몰리',
            email:'molly@ajou.ac.kr',
            password:'qwerty1234@@',
            // profileImage:,
            averageRating:4.5,
            ban:false,
            // keyword:,
            // salt:,
            // category:
        });
        sampleTrade.save().then(()=>{
            assert(sampleTrade.isNew === false);
            // console.log(sampleTrade);
            done();
        });
    });
});


describe('GET /getUserData',()=>{
    it('Ok, fine',(done)=>{
        request(app).get('/user/getUserData')
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



