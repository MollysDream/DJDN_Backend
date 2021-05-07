const mongoose = require('mongoose');
const assert = require('assert');
const expect = require('chai').expect;

// const mongooseAutoInc = require('mongoose-auto-increment');

// ES6 Promises
mongoose.Promise = global.Promise;

//
// //Connect to mongoDB
// before('Check connection',(done)=>{
//     mongoose.connect('mongodb://localhost:27017/DJDN',{
//         useFindAndModify: false,
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true
//     })
//     mongooseAutoInc.initialize(mongoose.connection);
//
//     mongoose.connection.once('open',()=> {
//         console.log('Connection has been made.');
//         done();
//     }).on('error',(error)=>{
//         console.log('Connection Error', error);
//     });
// })

describe('Drop all collections before each test',()=>{
    //Connect to mongoDB
    before('Check connection',(done)=>{
        mongoose.connect('mongodb://localhost:27017/DJDN',{
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        // mongooseAutoInc.initialize(mongoose.connection);

        mongoose.connection.once('open',()=> {
            console.log('Connection has been made.');
            done();
        }).on('error',(error)=>{
            console.log('Connection Error', error);
        });
    });

    it('Before start, drop all collections',(done)=>{
        // Drop the collection
        mongoose.connection.collections.categories.drop(()=>{
        });
        mongoose.connection.collections.posts.drop(()=>{
        });
        mongoose.connection.collections.users.drop(()=>{
        });
        mongoose.connection.collections.trades.drop(()=>{
            done();
        });
    });

});
