const express = require("express");
const router = express.Router();
const Address = require("../models/address");
const axios = require("axios")
const Report = require("../models/report");
const Post = require("../models/post");

//내 동네 인증
router.post("/reportDataParam", (req, res) => {
    const {reportUser, targetUser, targetPost, reportWhat, reportCategory, text} = req.body;
    console.log(`**/report/reportDataParam/서버통신**`);

    const report = new Report({
        reportUser: reportUser,
        targetUser: targetUser,
        targetPost: targetPost,
        reportWhat: reportWhat,
        reportCategory: reportCategory,
        text: text
    })

    console.log(report);

    report.save((err, report)=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(report);
        }
    })

});

router.get('/getAllReport', function(req,res,next){
    //const userId = req.query.userId;
    console.log(`**/report/getAllReport/서버통신**`);


    Report.find().populate('targetUser').populate('reportUser').populate('targetPost').sort({date:-1}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getAllReport DB오류"});
    })
})

module.exports = router;
