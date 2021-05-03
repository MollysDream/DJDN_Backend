const express = require("express");
const router = express.Router();
const User = require("../models/user");
const crypto = require("crypto");

// 회원가입

router.post("/join", async (req, res) => {
    console.log("hi")
    try {
        let obj = { email: req.body.email };

        let user = await User.findOne(obj);
        console.log(user);

        if (user) {
            res.json({
                message: "이메일이 중복되었습니다. 새로운 이메일을 입력해주세요.",
                dupYn: "1"
            });
        } else {
            crypto.randomBytes(64, (err, buf) => {
                if (err) {
                    console.log(err);
                } else {
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
                                    salt: buf.toString("base64")
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
                    console.log(req.body.password);
                    console.log(user.salt);
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
                                // console.log(key.toString('base64')); // 'dWhPkH6c4X1Y71A/DrAHhML3DyKQdEkUOIaSmYCI7xZkD5bLZhPF0dOSs2YZA/Y4B8XNfWd3DHIqR5234RtHzw=='

                                const obj = {
                                    email: req.body.email,
                                    password: key.toString("base64")
                                };

                                const user2 = await User.findOne(obj);
                                console.log(user2);
                                if (user2) {
                                    // 있으면 로그인 처리
                                    // console.log(req.body._id);
                                    res.json({
                                        message: "로그인 되었습니다!",
                                        login: "1",
                                        email: user2.email
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


module.exports = router;
