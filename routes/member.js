const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Admin = require("../models/admin");
const crypto = require("crypto");

// 회원가입

/*
send_param = {
    email: userId,
    password: userPassword,
    name: userName,
    nickname: userNickName
};*/
router.post("/join", async (req, res) => {
    console.log("router에서 실행된 API");
    try {
        let obj = { email: req.body.email };
        let user = await User.findOne(obj);
        console.log(user);

        // 중복되는 항목이 이미 DB에 있는지 검사
        if (user) {
            res.json({
                message: "이메일이 중복되었습니다. 새로운 이메일을 입력해주세요.",
                dupYn: "1"
            });
        }

        // 중복되는 항목 없다면 생성
        else {
            crypto.randomBytes(64, (err, buf) => {
                if (err) {
                    console.log(err);
                }

                // password 암호화 후 생성
                else {
                    crypto.pbkdf2(
                        req.body.password,
                        buf.toString("base64"),
                        100000,
                        64,
                        "sha512",
                        async (err, key) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(key.toString("base64"));
                                buf.toString("base64");
                                obj = {
                                    email: req.body.email,
                                    name: req.body.name,
                                    nickname: req.body.nickname,
                                    password: key.toString("base64"),
                                    salt: buf.toString("base64"),
                                    phoneNumber: req.body.phoneNumber
                                };
                                user = new User(obj);
                                await user.save();
                                res.json({ message: "회원가입 되었습니다!",dupYn: "0" });
                            }
                        }
                    );
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.json({ message: false });
    }
});

//로그인

/*
* send_param = {
      email: userId,
      password: userPassword
    }
*/
router.post("/login", async (req, res) => {
    try {
        //이메일 값으로 아이디가 존재하는지 확인
        await User.findOne({ email: req.body.email }, async (err, user) => {
            if (err) {
                console.log(err);
            } else {
                console.log(user);
                if (user) {
                    //아이디가 존재할 경우 이메일과 패스워드가 일치하는 회원이 있는지 확인


                    // console.log(req.body.password);
                    // console.log(user.salt);

                    crypto.pbkdf2(
                        req.body.password,
                        user.salt,
                        100000,
                        64,
                        "sha512",
                        async (err, key) => {
                            if (err) {
                                console.log(err);
                            } else {
                                const obj = {
                                    email: req.body.email,
                                    password: key.toString("base64")
                                };

                                const user2 = await User.findOne(obj);

                                // console.log(user2);

                                if (user2) {
                                    console.log("user2 id는 "+user2._id);

                                    await User.updateOne(
                                        { _id: user2._id },
                                        {
                                            $set:{
                                                firebaseFCM: req.body.token
                                            }
                                        })
                                    
                                    //admin일때도 token 저장
                                    await Admin.updateOne(
                                        { user_id: user2._id },
                                        {
                                            $set:{
                                                firebaseFCM: req.body.token
                                            }
                                        })    

                                    res.json({
                                        message: "로그인 되었습니다!",
                                        login: "1",
                                        userId: user2._id
                                    });
                                } else{
                                    res.json({ message: "아이디나 패스워드가 일치하지 않습니다.", login:"0" });
                                }
                            }
                        }
                    );
                } else {
                    res.json({ message: "아이디나 패스워드가 일치하지 않습니다.", login: "0" });
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.json({ message: "로그인 실패" });
    }
});

router.post('/autoLogin',async (req, res) =>{

    console.log('/member/autoLogin 실행');

    try {
        // req.body 저장
        let {userId, token} = req.body;
        console.log(`사용자 ID:${userId}, firebase token값: ${token} `);

        await User.updateOne(
            { _id: userId },
                {
                  $set: {
                      firebaseFCM : token   
                }
            }
        );
        
        //admin일 때도 token 저장
        await Admin.updateOne(
            { user_id: userId },
                {
                  $set: {
                      firebaseFCM : token   
                }
            }
        );

       res.json({ message: "자동 로그인에 성공했습니다." });
    } catch(err){
        console.log(err);
        res.json({ message: false });
    }
});


module.exports = router;
