let express = require('express');
let router = express.Router();

const Post = require('../models/post');
const Category = require('../models/category');

/* GET users listing. */
router.get('/getPost', function(req, res, next) {
    const page = req.query.page;
    console.log(`**/data/getPost/서버통신** ${page} 페이지 게시물 요청`)
    const LIMIT = 4
    //let page = req.params.page;
    //console.log(page);
    Post.find({}).sort({$natural:-1}).skip(page*LIMIT).limit(LIMIT).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPost DB오류"});
    })
});

// 홈화면에서 필터 적용하여 게시글 불러옴
router.get('/getPostFinal', function(req,res,next){
    //한번에 불러올 게시물 갯수
    const LIMIT = 4;

    const page = req.query.page;
    const category = req.query.category;
    const view = req.query.view;

    console.log(`**/data/getPostWithFilter/서버통신** ${page} 페이지 게시물 요청`)

    Post.find({category: {$in:category}})
        .sort({'view':-1}).sort({$natural:-1})
        .skip(page*LIMIT).limit(LIMIT).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPost DB오류"});
    })
})


router.get('/getPostBySearch', function(req,res,next){
    const searchValue = req.query.searchValue;
    console.log(`**/data/getPostBySearch/서버통신** ${searchValue} 검색 게시물 요청`);

    const searchOption = [
        {title: new RegExp(searchValue)},
        {text: new RegExp(searchValue)}
    ]
    Post.find({$or:searchOption}).sort({$natural:-1}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPostBySearch DB오류"});
    })

})

router.get('/getPostByCategory', function(req,res,next){
    // const category = req.query.category;
    const category = ['애견', '도움'];
    console.log(`**/data/getPostByCategory/서버통신** ${category} 카테고리 검색 게시물 요청`);

    console.log(category);
    Post.find({category: {$in:category}}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPostByCategory DB오류"});
    })

})

router.post('/createPost', function(req,res,next){
    console.log(`**/data/createPost/서버통신** 게시물 작성 요청`);

    const postData = req.body;
    //console.log(postData.userAddress['latitude']);

    const post=new Post({
        title: postData.title,
        image: postData.image,
        text: postData.text,
        category: postData.category,
        tag: postData.tag,
        price: postData.price,
        date: Date.now(),
        user_id: postData.user_id,
        latitude: postData.userAddress['latitude'],
        longitude: postData.userAddress['longitude'],
        addressName: postData.userAddress['addressName'],

    })
    console.log(post);

    post.save((err, user)=>{
        if(err){
            console.log(err);
            res.status(500).send({error:"DB오류"});
        }else {
            console.log("DB 저장완료");
            res.status(200).json(user);
        }
    })
})

router.get('/getCategoryList', function(req, res, next) {
    console.log('**/data/getCategoryList/서버통신** 카테고리 리스트 요청')

    Category.findOne({}).then((data)=>{
        console.log(data);
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getCategory DB오류"});
    })
});

router.post('/updatePostView', function(req, res, next) {
    const {postId, view} = req.body;
    console.log(`**/data/updatePostView/서버통신** 게시글 ID:${postId} 조회수: ${view}로 수정`)

    Post.findOneAndUpdate({'_id':postId}, {view:view})
        .then((result)=>{
            console.log(`${postId} 게시글 조회수 수정 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPost DB오류"});
    })
});
module.exports = router;
