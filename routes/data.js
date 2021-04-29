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

router.post('/createPost', function(req,res,next){

    console.log(`**/data/createPost/서버통신** 게시물 작성 요청`);

    const{title,image,text, price, category,tag, user_id} = req.body;
    const user=new Post({
        title: title,
        image: image,
        text: text,
        category: category,
        tag: tag,
        date: Date.now()
    })

    user.save((err, user)=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(user);
        }
    })


})

module.exports = router;
