const Chat = require("../models/chat");
const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.route("/:userToSend")
    .get(async (req, res) => {
        try {
            if (req.user.username) {
                const userToSend = req.params.userToSend;
                const chat = await Chat.findOne({
                    $or: [
                        { $and: [{ user1: req.user.username }, { user2: userToSend }] },
                        { $and: [{ user1: userToSend }, { user2: req.user.username }] }
                    ]
                });
                if (chat) {
                    chat.messages.forEach(msg => {
                        if (!msg.delivered && msg.sendingUser !== req.user.username) {
                            msg.delivered = true;
                        }
                    });
                    await chat.save().then().catch(err => console.log(err));
                }
                return res.json(chat);
            } else {
                return res.sendStatus(404);
            }
        } catch (e) {
            return res.sendStatus(400).json(e.message);
        }
    });

router.route("/newMessages")
    .put(async (req, res) => {
        try {
            if (req.user.username) {
                const chats = await Chat.find({
                    $or: [
                        { user1: req.user.username },
                        { user2: req.user.username }
                    ]
                });
                const newMessages = [];
                if (chats.length) {
                    chats.forEach(c => {
                        c.messages.forEach(msg => {
                            if (!msg.delivered && msg.sendingUser !== req.user.username) {
                                msg.delivered = true;
                                newMessages.push({
                                    sendingUser: msg.sendingUser,
                                    message: msg.message
                                });
                            }
                        });
                        c.save().then().catch(err => console.log(err));
                    });
                }
                return res.json(newMessages);
            } else {
                return res.sendStatus(404);
            }
        } catch (e) {
            console.log(e.message);
        }
    });

router.route("/users")
    .get(async (req, res) => {
        console.log("GETUSERS");
        if (req.user) {
            const registeredUsers = await User.find({});
            return res.json(registeredUsers);
        }
        return res.sendStatus(400);
    });

module.exports.router = router;
