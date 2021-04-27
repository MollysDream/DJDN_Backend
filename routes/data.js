let express = require('express');
let router = express.Router();

const Post = require("../models/post");

/* GET users listing. */
router.get('/getPost', function(req, res, next) {
    const page = req.query.page;
    console.log(`**/data/getPost/서버통신** ${page} 페이지 게시물 요청`)
    const LIMIT = 1
    //let page = req.params.page;
    //console.log(page);
    Post.find({}).skip(page*LIMIT).limit(LIMIT).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPost DB오류"});
    })
});

router.get('/getPostBySearch', function(req,res,next){
    const searchValue = req.query.searchValue;
    console.log(`**/data/getPostBySearch/서버통신** ${searchValue} 검색 게시물 요청`);

    const searchOption = [
        {title: new RegExp(searchValue)},
        {content: new RegExp(searchValue)}
    ]
    Post.find({$or:searchOption}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPostBySearch DB오류"});
    })

})



module.exports = router;
