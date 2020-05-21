const Chat = require("../models/chat");
const express = require("express");
const router = express.Router();
const HttpStatus = require("http-status-codes");

router.route("/:userToSend")
    .get(async (req, res) => {
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
    });


module.exports.router = router;


/* socket.on("chatSelected", async function (chatUser) {
    console.log("CHATSELECTED");

/*
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
