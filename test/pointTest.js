const mongoose = require('mongoose');
const assert = require('assert');
const Post = require("../models/post");
const app = require('../app.js');
const request = require('supertest');
const Point = require('../models/point');

const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)




describe('Create a Point instance', ()=>{
	it('Saves a point to the DB',()=>{
		let samplePoint = new Point({
			point:10,
			user_id: '60a47cabcff1311284a10d98'
		});
		samplePoint.save().then(()=>{
			assert(samplePoint.isNew === false);
			done();
		});
	});
});

