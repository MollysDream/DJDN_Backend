const express = require("express");
const router = express.Router();
const Address = require("../models/address");
const axios = require("axios")


//내 동네 추가
router.post("/add", async (req, res) => {

});

//현재 위치 받아오기
router.post("/currentLocation", async (req, res) => {

  try {
    var REST_API_KEY = '68099abb33631383a581fb96b131ca2f'
    const address = await axios({
      url: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x='+req.body.currentX+'&y='+req.body.currentY ,
      method: 'get',
      headers: {'Authorization': 'KakaoAK '+ REST_API_KEY },
    });
    console.log(address.data.documents[0].region_3depth_name);
    res.json({ message: "동네인증이 되었습니다.", address:address.data.documents[0].region_3depth_name });
  } catch (err) {
    console.log(err);
    res.json({message: "동네인증에 실패하였습니다."})
  }
});

//내 동네 인증
router.post("/certifyAddress", async (req, res) => {
  console.log("hi "+req.body.email)
  try{
    obj = {
      isAuth : true,
      userId: req.body.userId,
      addressName: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    };
    address = new Address(obj);
    await address.save();
    res.json({ message: "동네 인증을 완료했습니다!" });
  } catch (err) {
    console.log(err);
  }
});

//사용자 인증 동네 가져오기
router.post("/checkAddress", async (req, res) => {
  try{
    const address= await Address.find({userId:req.body.userId})
    res.json({address:address})
  } catch (err) {
    console.log(err);
    res.json({message:false})
  }
})

//게시글 검색 반경값 변경
router.post("/updateRadius", async (req, res) => {
  const {userId, radius} = req.body;
  console.log(`**/address/updateRadius/서버통신** 사용자 ID:${userId} 반경: ${radius}m로 수정`)
  try{
    const address= await Address.updateMany({userId:userId},{radius:radius})
    console.log(`${radius}m로 반경 수정 완료`)
    res.status(200).json(address)
  } catch (err) {
    console.log(err);
    res.status(300).send({error:err})
  }
})

module.exports = router;
