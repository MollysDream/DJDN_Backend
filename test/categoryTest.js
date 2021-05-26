const mongoose = require('mongoose');
const assert = require('assert');
const Trade = require("../models/trade");
const Post = require("../models/post");
const User = require("../models/user");
const Category = require("../models/category");
const app = require('../app.js');
const request = require('supertest');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)


describe('Drop all collections before each test',()=>{F
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


describe('category 생성,', ()=>{
	it('Save a categoryList to the DB',()=>{
		const category = new Category({
			category: {
				'a':false,
				'b':false,
				'c':false,
				'd':false,
				'e':false
			}
		})
		category.save().then(()=>{
			assert(category.isNew === false);
			console.log(category);
			done();
		});
	});
})
