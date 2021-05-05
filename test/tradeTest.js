const mongoose = require('mongoose');
const assert = require('assert');
const Trade = require("../models/trade");
const Post = require("../models/post");
const User = require("../models/user");
const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)


describe('Drop all collections before each test',()=>{
    it('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.trades.drop(()=>{
            done();
        });
    });
});


// ++ 테스트용 User 2명이상, Post 1개 이상 생성할것
describe('Create a Trade instance', ()=>{

    it('Saves a trade to the DB',()=>{
        let sampleTrade = new Trade({
            startTime : Date.now(),
            endTime:Date.now(),
            workTime:Date.now(),
            location: "우만2동",
            complete: false,
            userList:['6092ca8ecd624853f80503ca'],
            post:'608fe4836afed10b5c352344'
        });
        sampleTrade.save().then(()=>{
            assert(sampleTrade.isNew === false);
            // console.log(sampleTrade);
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



