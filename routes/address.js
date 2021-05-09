const express = require("express");
const router = express.Router();
const Address = require("../models/address");
const axios = require("axios")


//내 동네 추가
router.post("/add", async (req, res) => {

});

//현재 위치 받아오기 (동네)
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

//현재 위치 받아오기 (상세주소)
router.post("/currentAddress", async (req, res) => {

  try {
    var REST_API_KEY = '68099abb33631383a581fb96b131ca2f'
    const address = await axios({
      url: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x='+req.body.currentX+'&y='+req.body.currentY ,
      method: 'get',
      headers: {'Authorization': 'KakaoAK '+ REST_API_KEY },
    });
    console.log(address.data.documents[0].address_name);
    res.json({ message: "거래장소가 설정되었습니다", address:address.data.documents[0].address_name });
  } catch (err) {
    console.log(err);
    res.json({message: "거래장소 설정에 실패하였습니다"})
  }
});

//내 동네 인증
router.post("/certifyAddress", async (req, res) => {
  const {userId, addressIndex, addressName, latitude, longitude} = req.body;
  console.log(`**/address/certifyAddress/서버통신**`);

  try{
    const returnData= await Address.findOneAndUpdate({userId:userId, addressIndex:addressIndex},
        {
          isAuth: true,
          addressName:addressName,
          latitude: latitude,
          longitude: longitude
        })
    console.log(`${addressName} DB 저장 완료!!`)
    res.status(200).json(returnData);
  }catch(err){
    console.log(err);
    res.status(300).send({error:err});
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
  const {userId, radius, addressIndex} = req.body;
  console.log(`**/address/updateRadius/서버통신** 사용자 ID:${userId} 인덱스: ${addressIndex} 반경: ${radius}m로 수정`)
  try{
    const address= await Address.findOneAndUpdate({userId:userId, addressIndex:addressIndex},{radius:radius})
    console.log(`${radius}m로 반경 수정 완료`)
    res.status(200).json(address)
  } catch (err) {
    console.log(err);
    res.status(300).send({error:err})
  }
})

// **동 저장 ( 새로운 address 생성 )
router.post("/createAddress", async (req, res) => {
  const {userId, addressName, addressIndex} = req.body;
  console.log(`**/address/createAddress/서버통신** 사용자 ID:${userId} 동네: ${addressName} 인덱스: ${addressIndex} 저장`)
  try{
    obj = {
      userId: userId,
      addressName: addressName,
      addressIndex: addressIndex
    };
    let address = new Address(obj);
    await address.save();
    console.log('동네 저장 완료!!!');
    res.json({ message: "동네 저장을 완료했습니다!" });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/deleteAddress', function(req, res, next) {
  const userId = req.query.userId;
  const addressIndex = req.query.addressIndex;
  console.log(`**/data/deleteAddress/서버통신** 사용자 ID:${userId} 인덱스:${addressIndex} 주소 삭제`)

  Address.findOneAndDelete({'userId':userId, 'addressIndex':addressIndex})
      .then((result)=>{
        console.log(`사용자 ID:${userId} 인덱스:${addressIndex} 주소 삭제 완료`);
        res.status(200).json(result);
      }).catch((err)=>{
    console.log(err);
    res.status(500).send({error:"deleteAddress DB오류"});
  })
});

module.exports = router;
