const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

//내 동네 추가
router.post("/add", async (req, res) => {
    
  });

//내 동네 인증
router.post("/certifyAddress", async (req, res) => {
  console.log("address"+req.body.address)
    try {
        await Address.update(
          { location: req.body.location },
          {
            $set: {
              email:req.body.email,  
            }
          }
        );
        res.json({ message: "동네인증이 되었습니다." });
      } catch (err) {
        console.log(err);
        res.json({ message: false });
      }
});

  
  
  module.exports = router;