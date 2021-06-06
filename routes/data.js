let express = require('express');
let router = express.Router();

const Post = require('../models/post');
const User = require('../models/user')
const Category = require('../models/category');
const Address = require('../models/address')
const ChatRoom = require('../models/chatRoom');

var admin = require('firebase-admin');
var serviceAccount = require("../key/appKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
  });

/* GET users listing. */
router.get('/getPost',function(req, res, next) {
    const LIMIT = 4

    const page = req.query.page;
    const userId = req.query.userId;
    console.log(`**/data/getPost/서버통신** ${page} 페이지 게시물 요청/ 사용자 ID: ${userId}`)

    User.findOne({_id:userId}).then((data)=>{
        //console.log(data);
        const category = data.category
        const sort = data.sort
        const addressIndex = data.addressIndex
        Address.findOne({userId:userId, addressIndex:addressIndex}).then((addressData)=>{
            console.log(addressData.longitude);
            const LONGITUDE = addressData.longitude;
            const LATITUDE = addressData.latitude;
            const MAXDISTANCE = addressData.radius;
            console.log(MAXDISTANCE);
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
            }else if(sort == 1){ // 거리순 정렬
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
            }else{ //키워드 정렬
                console.log("*****키워드 정렬*****")
                let searchOption=[];
                data.keyword.map(keyword=>{
                    searchOption.push({title: new RegExp(keyword)});
                    searchOption.push({text: new RegExp(keyword)});
                })

                Post.find({
                    location: {
                        $geoWithin: {
                            $centerSphere: [[LONGITUDE, LATITUDE], (MAXDISTANCE/1000) / 6378.1]
                        }
                    },
                    category: {$in:category},
                    $or:searchOption
                })
                    .sort({date:-1}).skip(page*LIMIT).limit(LIMIT)
                    .then((data)=>{
                        res.status(200).json(data);
                    }).catch((err)=>{
                    console.log(err);
                    res.status(500).send({error:"getPostBySearch DB오류"});
                })
            }


        }).catch(err=>{ //Address.findOne()
            console.log(err);
            console.log('위치정보 Find 에러')
        })

    }).catch((err)=>{ // User.findOne()
        console.log(err);
        console.log('사용자 userId Find 실패');
    })

});


router.get('/getPostBySearch', function(req,res,next){
    const searchValue = req.query.searchValue;
    const userId = req.query.userId;
    console.log(`**/data/getPostBySearch/서버통신** ${searchValue} 검색 게시물 요청`);

    const searchOption = [
        {title: new RegExp(searchValue)},
        {text: new RegExp(searchValue)}
    ]

    User.findOne({_id:userId}).then((data)=>{
        //console.log(data);
        const category = data.category
        const sort = data.sort
        const addressIndex = data.addressIndex
        Address.findOne({userId:userId, addressIndex:addressIndex}).then((addressData)=>{
            console.log(addressData.longitude);
            const LONGITUDE = addressData.longitude;
            const LATITUDE = addressData.latitude;
            const MAXDISTANCE = addressData.radius;
            console.log(MAXDISTANCE);
            if(sort == 0) {//최신순 정렬이면
                console.log("*****최신순 정렬*****")
                Post.find({
                    location: {
                        $geoWithin: {
                            $centerSphere: [[LONGITUDE, LATITUDE], (MAXDISTANCE/1000) / 6378.1]
                        }
                    },
                    category: {$in:category},
                    $or:searchOption
                })
                    .sort({date:-1})
                    .then((data)=>{
                    res.status(200).json(data);
                }).catch((err)=>{
                    console.log(err);
                    res.status(500).send({error:"getPostBySearch DB오류"});
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
                    category: {$in:category},
                    $or:searchOption
                }).then((data)=>{
                    res.status(200).json(data);
                }).catch((err)=>{
                    console.log(err);
                    res.status(500).send({error:"getPostBySearch DB오류"});
                })
            }
        }).catch(err=>{ //Address.findOne()
            console.log(err);
            console.log('위치정보 Find 에러')
        })

    }).catch((err)=>{ // User.findOne()
        console.log(err);
        console.log('사용자 userId Find 실패');
    })

})

router.get('/getUserPost', function(req,res,next){
    const userId = req.query.userId;
    console.log(`**/data/getUserPost/서버통신** ID: ${userId}가 작성한 게시물 요청`);


    Post.find({user_id:userId}).sort({date:-1}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getUserPost DB오류"});
    })
})

////
router.get('/getPostTitle', function(req,res,next){
    const postId = req.query.postId;
    console.log("postID : ", postId);

    Post.find({_id:postId}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getUserPost DB오류"});
    })
})
////


router.get('/getUserTradingPost', function(req,res,next){
    const userId = req.query.userId;
    console.log(`**/data/getUserTradingPost/서버통신** ID: ${userId}의 거래중인 게시물 요청`);

    ChatRoom.find({hostId:userId},).then((data)=>{
        //console.log(data);
        let postIdList = [];
        data.map((post)=>{
            postIdList.push(post.postId);
        })
        console.log(postIdList);

        Post.find({_id: {$in:postIdList}}).sort({date:-1}).then((postdata)=>{
            res.status(200).json(postdata);
        }).catch(err=>{
            console.log(err);
            res.status(500).send({error:"getUserTradingPost Post Find DB 오류"})
        })

        res.status(500);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getUserTradingPost Chatroom Find DB 오류"})
    })


})

/*router.get('/getPostByCategory', function(req,res,next){
    // const category = req.query.category;
    const category = ['애견', '도움'];
    console.log(`**!/data/getPostByCategory/서버통신** ${category} 카테고리 검색 게시물 요청`);

    console.log(category);
    Post.find({category: {$in:category}}).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"getPostByCategory DB오류"});
    })

})*/



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

            /*
            * 푸시알림을 해봅시다.
            * 먼저, user에서 키워드 정보, addressIndex를 가져와요
            * 다음으로, 키워드와 post.title이 같은 사용자 id를 가져옵시다.
            * 해당되는 id의 사용자의 fcm token값을 가져옵시다.
            * 푸시 알림 메시지의 포맷을 정해줍니다 -> title,tag 등..
            * sendFCM 메시지를 통해 메시지 보냅시다!
            */

            // const keywordOwner = await User.findOne(
            //     {keyword: postData.title},
            // )

            // const fcm = keywordOwner.firebaseFCM

            // const message = {
            //     notification: {
            //       title: keywordOwner.keyword,
            //       tag: keywordOwner.keyword,
            //       body: postData.title,
            //     },
            //     data: {
            //       type: 'Keyword'
            //     },
            //   };

            //   if (fcm){
            //    admin.messaging().sendToDevice(fcm, message, { priority: 'high' })
            //     .then((response) => {
            //         console.log(response.results);
            //         return true;
            //     })
            //     .catch((error) => {
            //         console.log('Error sending message:', error);
            //         return false;
            //     });
            //   }
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

router.post('/updatePostTradeStatus', function(req, res, next) {
    const {postId, status} = req.body;
    console.log(`**/data/updatePostTradeStatus/서버통신** 게시글 ID:${postId} 상태: ${status}로 수정`)

    Post.findOneAndUpdate({'_id':postId}, {tradeStatus:status})
        .then((result)=>{
            console.log(`${postId} 게시글 거래상태:${status} 수정 완료`);
            res.status(200).json(result);
        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"updatePostTradeStatus DB오류"});
    })
});

router.delete('/deletePost', function(req, res, next) {
    const postId = req.query.postId;
    console.log(`**/data/deletePost/서버통신** 게시글 ID:${postId} 게시글 삭제`)

    Post.findOneAndDelete({'_id':postId})
        .then((result)=>{

            ChatRoom.deleteMany({'postId':postId}).then(result=>{
                console.log(`${postId} 게시글 삭제 완료`);
                res.status(200).json(result);
            }).catch(err=>{
                console.log(err);
                res.status(500).send({error:"deletePost DB오류"});
            })

        }).catch((err)=>{
        console.log(err);
        res.status(500).send({error:"deletePost DB오류"});
    })
});

module.exports = router;
