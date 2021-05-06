let express = require('express');
let router = express.Router();

const Post = require('../models/post');
const User = require('../models/user')
const Category = require('../models/category');
const Address = require('../models/address')


/* GET users listing. */
router.get('/getPost',function(req, res, next) {
    const LIMIT = 4

    const page = req.query.page;
    const userId = req.query.userId;
    console.log(`**/data/getPost/서버통신** ${page} 페이지 게시물 요청/ 사용자 ID: ${userId}`)

    /*const userData = User.findOne({_id:userId});
    console.log(userData);*/
    Address.findOne({userId:userId}).then((addressData)=>{
        console.log(addressData.longitude);
        const LONGITUDE = addressData.longitude;
        const LATITUDE = addressData.latitude;
        User.findOne({_id:userId}).then((data)=>{
            //console.log(data);
            const category = data.category
            const sort = data.sort


            const MAXDISTANCE = 12000;

            if(sort == 0) {//최신순 정렬이면
                console.log("*****최신순 정렬*****")
                Post.find({
                    location: {
                        $geoWithin: {
                            $centerSphere: [[LONGITUDE, LATITUDE], (MAXDISTANCE/1000) / 6378.1]
                        }
                    }
                    ,category: {$in:category}
                })
                    .sort({date:-1})
                    .skip(page*LIMIT).limit(LIMIT).then((data)=>{
                    res.status(200).json(data);
                }).catch((err)=>{
                    console.log(err);
                    res.status(500).send({error:"getPost DB오류"});
                })
            }else{ // 거리순 정렬
                console.log("*****거리순 정렬*****")
                Post.find({
                    location: {
                        $nearSphere: {
                            $geometry: {
                                type: 'Point',
                                coordinates: [LONGITUDE, LATITUDE]
                            },
                            $maxDistance: MAXDISTANCE
                        }
                    },
                    category: {$in:category}
                }).skip(page*LIMIT).limit(LIMIT).then((data)=>{
                    res.status(200).json(data);
                }).catch((err)=>{
                    console.log(err);
                    res.status(500).send({error:"getPost DB오류"});
                })
            }



        }).catch((err)=>{ // User.findOne()
            console.log(err);
            console.log('사용자 userId Find 실패');
        })
    }).catch(err=>{ //Address.findOne()
      console.log(err);
      console.log('위치정보 Find 에러')
    })

    //.sort({$natural:-1})
});


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

router.get('/getUserPost', function(req,res,next){
    const userId = req.query.userId;
    console.log(`**/data/getUserPost/서버통신** ID: ${userId}의 검색 게시물 요청`);


    Post.find({user_id:userId}).sort({Date:-1}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getUserPost DB오류"});
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
    console.log(postData.userAddress);

    const post=new Post({
        title: postData.title,
        image: postData.image,
        text: postData.text,
        category: postData.category,
        tag: postData.tag,
        price: postData.price,
        date: Date.now(),
        user_id: postData.user_id,

        latitude: postData.userAddress.latitude,
        longitude: postData.userAddress.longitude,
        addressName: postData.userAddress.addressName,
        location:{coordinates: [postData.userAddress.longitude, postData.userAddress.latitude]}


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

router.post('/updatePost', function(req,res,next){
    console.log(`**/data/updatePost/서버통신** 게시물 작성 요청`);

    const postData = req.body;

    console.log(postData);

    Post.findOneAndUpdate({'_id':postData.postId},
        {
            title:postData.title,
            image: postData.image,
            text:postData.text,
            category:postData.category,
            price:postData.price,

        })
        .then((result)=>{
            console.log(`${postData.postId} 게시글 조회수 수정 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"postData DB오류"});
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
        res.status(500).send({error:"updatePostView DB오류"});
    })
});

router.delete('/deletePost', function(req, res, next) {
    const postId = req.query.postId;
    console.log(`**/data/deletePost/서버통신** 게시글 ID:${postId} 게시글 삭제`)

    Post.findOneAndDelete({'_id':postId})
        .then((result)=>{
            console.log(`${postId} 게시글 삭제 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"deletePost DB오류"});
    })
});

module.exports = router;
