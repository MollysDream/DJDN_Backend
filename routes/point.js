const express = require("express");
const router = express.Router();
const Point = require("../models/point");
const User = require("../models/user");
const axios = require("axios")


//포인트 추가
router.post('/addPoint', function(req,res,next){
	console.log(`/point/addPoint 실행`);
	const {user_id, amount} = req.body;
	// console.log(targetId);

	Point.findOneAndUpdate({'user_id':user_id},
		{
		$inc:{point: amount}
		})
		.then((result)=>{
			console.log(`Point ${amount}만큼 충전 완료`);
			res.status(200).json(result);
		}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"addPoint DB오류"});
	})
})

//포인트 조회
router.get('/getPointById', function(req, res, next) {
	const userId = req.query.userId;
	console.log(`/point/addPoint 실행`);

	Point.find({'user_id': userId}).then((data)=>{
		res.status(200).json(data);
	}).catch((err)=>{
		console.log(err);
		res.status(500).send({error:"getPointById DB오류"});
	})
});


router.post("/createPoint", function(req,res,next){
	console.log(`**/advertisement/createPoint/서버통신** 사용자 포인트 생성`);
	const {email} = req.body;
	console.log(email);
	User.findOne({email:email}).then((userData)=>{
		//console.log(userData);
		const point = new Point({
			point:0,
			user_id:userData._id
		})
		point.save((err, user)=>{
			if(err){
				console.log(err);
				res.status(500).send({error:"DB오류"});
			}else {
				console.log("Point DB 저장완료");
				res.status(200).json(user);
			}
		})
	}).catch(err=>{
		console.log(err);
	})
})

module.exports = router;
