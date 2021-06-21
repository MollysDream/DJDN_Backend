const mongoose = require('mongoose');
const assert = require('assert');
const Post = require("../models/post");
const app = require('../app.js');
const Point = require('../models/point');
const request = require('supertest');
const expect = require('chai').expect;
mongoose.set('useCreateIndex', true)

describe('포인트 테스트', ()=>{
	let userId;
	let email = 'mochaTest@ajou.ac.kr';
	let point;
	before('사용자 생성', ()=>{
		request(app).post('/member/join')
			.send({
				email: 'mochaTest@ajou.ac.kr',
				password: 'qwerty1234@@',
				name: 'mochaTest',
				nickname: 'mochaTest',
				phoneNumber: '01012345678'
			})
			.then((res)=>{
				console.log(res);
				expect(res.name).equal("mochaTest");
				done();
			})
			.catch((err)=> done(err));
		mongoose.connection.collections.users.findOne({email: email})
			.then((res)=>{
				userId=res._id;
				email=res.email;
			})
		console.log(email)
	});
	it('포인트 생성 확인',()=>{
		let samplePoint = new Point({
			point:10,
			user_id: userId
		});
		samplePoint.save()
			.then(()=>{
			assert(samplePoint.isNew === false);
				mongoose.connection.collections.points.findOne({user_id: userId})
					.then((res)=>{
						expect(res.point).equal(0);
						console.log(res.point);
						point=res.point;
					})

				console.log(point);
		})
			.then(()=>{
				done();
			});


	});
});

