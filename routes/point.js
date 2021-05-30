const express = require("express");
const router = express.Router();
const Point = require("../models/point");
const axios = require("axios")


//포인트 추가
router.post('/addPoint', function(req,res,next){
	console.log(`/point/addPoint 실행`);
	const {targetId, amount} = req.body;
	// console.log(targetId);

	Point.findOneAndUpdate({'user_id':targetId},
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

module.exports = router;
