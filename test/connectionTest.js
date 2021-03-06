const mongoose = require('mongoose');
const assert = require('assert');
const expect = require('chai').expect;


mongoose.Promise = global.Promise;

describe('Drop all collections before each test',()=>{
    //Connect to mongoDB
    before('Check connection',(done)=>{
        mongoose.connect('mongodb://localhost:27017/DJDN',{
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        mongoose.connection.once('open',()=> {
            console.log('Connection has been made.');
            done();
        }).on('error',(error)=>{
            console.log('Connection Error', error);
        });
    });

    it.skip('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.addresses.drop(()=>{
        });
        mongoose.connection.collections.advertisements.drop(()=>{
        });
        mongoose.connection.collections.chatrooms.drop(()=>{
        });
        mongoose.connection.collections.chats.drop(()=>{
        });
        mongoose.connection.collections.categories.drop(()=>{
        });
        mongoose.connection.collections.points.drop(()=>{
        });
        mongoose.connection.collections.posts.drop(()=>{
        });
        mongoose.connection.collections.reports.drop(()=>{
        });
        mongoose.connection.collections.users.drop(()=>{
        });
        mongoose.connection.collections.trades.drop(()=>{
            done();
        });
    });

});
