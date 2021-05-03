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

router.get('/getPostBySearch', function(req,res,next){
    const searchValue = req.query.searchValue;
    console.log(`**/data/getPostBySearch/서버통신** ${searchValue} 검색 게시물 요청`);

    const searchOption = [
        {title: new RegExp(searchValue)},
        {text: new RegExp(searchValue)}
    ]
    Post.find({$or:searchOption}).then((data)=>{
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

    const{title,image,text, price, category,tag, user_id} = req.body;
    const post=new Post({
        title: title,
        image: image,
        text: text,
        category: category,
        tag: tag,
        price: price,
        date: Date.now()
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
