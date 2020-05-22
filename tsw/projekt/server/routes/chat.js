const Chat = require("../models/chat");
const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.route("/:userToSend")
    .get(async (req, res) => {
        if (req.user.username) {
            const userToSend = req.params.userToSend;
            console.log("AXIOUS");
            console.log(userToSend);
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
                chat.save();
            }
            return res.json(chat);
        } else {
            return res.sendStatus(404);
        }
    });

router.route("/users")
    .get(async (req, res) => {
        console.log("GETUSERS");
        if (req.user) {
            const registeredUsers = await User.find({});
            console.log(registeredUsers);
            /* const userNamesWithStatus = [];
            registeredUsers.forEach(u => {
                userNamesWithStatus.push({
                    username: u.username
                });
            }); */
            return res.json(registeredUsers);
        }
        return res.sendStatus(400);
    });

module.exports.router = router;

/* socket.on("chatSelected", async function (chatUser) {
    console.log("CHATSELECTED");

/*
    $or: [
    $or: [
        { $and: [{ user1: user.username }, { user2: chatUser }] },
        { $and: [{ user1: chatUser }, { user2: user.username }] }
    ]

const chat = await Chat.findOne({
    $or: [{ user1: user.username }, { user2: user.username }]
});
// console.log(chat);

// console.log("CHATY ZNALEZIONE");
if (chat) {
    chat.messages.forEach(msg => {
        if (!msg.delivered && msg.sendingUser !== user.username) {
            msg.delivered = true;
        }
    });
    chat.save();
}
/*
console.log("CHATY");
const chatsedrh = await Chat.find({});
console.log(chatsedrh);
socket.emit("chatSelected", chat);
}); */
