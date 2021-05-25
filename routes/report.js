const express = require("express");
const router = express.Router();
const Address = require("../models/address");
const axios = require("axios")
const Report = require("../models/report");
const Post = require("../models/post");
const User = require("../models/user");

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

router.get('/getPostReport', function(req,res,next){
    const category = req.query.category;
    console.log(`**/report/getPostReport/서버통신**`);

    if(category == '')
    {
        Report.find({reportWhat:0}).populate('targetUser').populate('reportUser').populate('targetPost').sort({date:-1}).then((data)=>{
            res.status(200).json(data);
        }).catch((err)=>{
            console.log(err);
            res.status(500).send({error:"getPostReport DB오류"});
        })
    }else{
        Report.find({reportWhat:0, reportCategory:category}).populate('targetUser').populate('reportUser').populate('targetPost').sort({date:-1}).then((data)=>{
            res.status(200).json(data);
        }).catch((err)=>{
            console.log(err);
            res.status(500).send({error:"getPostReport DB오류"});
        })
    }

})

router.get('/getUserReport', function(req,res,next){
    const category = req.query.category;
    console.log(`**/report/getUserReport/서버통신**`);

    console.log(category);
    if(category == '')
    {
        Report.find({reportWhat:1}).populate('targetUser').populate('reportUser').populate('targetPost').sort({date:-1}).then((data)=>{
            res.status(200).json(data);
        }).catch((err)=>{
            console.log(err);
            res.status(500).send({error:"getUserReport DB오류"});
        })
    }else{
        Report.find({reportWhat:1, reportCategory:category}).populate('targetUser').populate('reportUser').populate('targetPost').sort({date:-1}).then((data)=>{
            res.status(200).json(data);
        }).catch((err)=>{
            console.log(err);
            res.status(500).send({error:"getUserReport DB오류"});
        })
    }

})

router.delete('/deleteReport', function(req, res, next) {
    const reportId = req.query.reportId;
    console.log(`**/data/deleteReport/서버통신** 신고 ID:${reportId} 신고 삭제`)

    Report.findOneAndDelete({'_id':reportId})
        .then((result)=>{
            console.log(`${reportId} 신고 삭제 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"deleteReport DB오류"});
    })
});

router.delete('/deletePostandReport', function(req, res, next) {
    const postId = req.query.postId;
    console.log(`**/data/deletePostandReport/서버통신** 게시글 ID:${postId} 게시글 및 신고 삭제`)

    Post.findOneAndDelete({'_id':postId})
        .then((result)=>{
            console.log(`${postId} 게시물 삭제 완료`);

            Report.deleteMany({'targetPost':postId})
            .then(result=>{
                console.log('신고 삭제 완료')
                res.status(200).json(result);
            }).catch((err)=>{
                console.log(err);
                res.status(500).send({error:"deletePostandReport 신고삭제 DB오류"});
            })

        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"deletePostandReport DB오류"});
    })
});

router.post('/banUser', function(req, res, next) {
    const {userId} = req.body;
    console.log(`**/report/banUser/서버통신** 사용자 ID:${userId} 밴: True 로 수정`)

    User.findOneAndUpdate({'_id':userId}, {ban:true})
        .then((result)=>{
            console.log(`사용자 ID:${userId} 밴: True 로 수정 완료`);

            Report.updateMany({'targetUser':userId}, {done:true})
                .then((result)=>{
                    console.log(`신고 처리상태 True 로 수정 완료`);
                    res.status(200).json(result);
                }).catch((err)=>{
                console.log(err);
                res.status(500).send({error:"banUser DB오류"});
            })

        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"banUser DB오류"});
    })
});

router.post('/unBanUser', function(req, res, next) {
    const {userId} = req.body;
    console.log(`**/report/unBanUser/서버통신** 사용자 ID:${userId} 밴: False 로 수정`)

    User.findOneAndUpdate({'_id':userId}, {ban:false})
        .then((result)=>{
            console.log(`사용자 ID:${userId} 밴: False 로 수정 완료`);
            Report.updateMany({'targetUser':userId}, {done:false})
                .then((result)=>{
                    console.log(`신고 처리상태 True 로 수정 완료`);
                    res.status(200).json(result);
                }).catch((err)=>{
                console.log(err);
                res.status(500).send({error:"banUser DB오류"});
            })
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"unBanUser DB오류"});
    })
});

module.exports = router;
