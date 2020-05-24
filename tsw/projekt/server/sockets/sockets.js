const Chat = require("../models/chat");
const socket = require("socket.io");
const User = require("../models/user");
const Auction = require("../models/auction");

module.exports.listen = server => {
    const io = socket(server);
    const onlineUsers = [];

    io.on("connection", socket => {
        let user;
        if (socket.request.user) {
            user = {
                username: socket.request.user.username,
                userId: socket.request.user.id,
                socketId: socket.id
            };
            if (!onlineUsers.find(u => u.username === socket.request.user.username)) {
                onlineUsers.push(user);
            }
        }

        socket.on("chat", async (msg) => {
            const destUserOnline = onlineUsers.find(
                u => u.username === msg.destinationUser
            );

            const destUserInDb = await User.findOne({
                username: msg.destinationUser
            });

            if (msg.length < 0) {
                socket.emit("chat", "Message is required");
            }
            if (!destUserInDb) {
                socket.emit("chat", "No user found with given user name.");
            }

            if (destUserOnline) {
                socket.broadcast
                    .to(destUserOnline.socketId)
                    .emit("chat",
                        {
                            sendingUser: user.username,
                            message: msg.message
                        }
                    );
                console.log("WYSLANO do:" + destUserOnline.username);
            }

            let chat = await Chat.findOne({
                $or: [{ user1: user.username }, { user2: user.username }]
            });

            if (!msg.message) {
                msg.message = "";
            }

            const newMessage = {
                sendingUser: user.username,
                message: msg.message,
                delivered: false
            };
            try {
                if (!chat) {
                    chat = await new Chat({
                        user1: user.username,
                        user2: msg.destinationUser
                    });
                    chat.messages = {
                        sendingUser: user.username,
                        message: newMessage.message,
                        delivered: newMessage.delivered
                    };
                } else {
                    chat.messages.push(newMessage);
                }
                await chat.save();
            } catch (e) {
                console.log(e);
            }

            // console.log(chatInDb);
        });

        /*
        socket.on("chat", async (msg) => {
            const destUserInDb = await User.findOne({
                username: msg.destinationUser
            });

            if (msg.length < 0) {
                socket.emit("chat", "Message is required");
            }
            if (!destUserInDb) {
                socket.emit("chat", "No user found with given user name.");
            } else {
                try {
                    let chat = await Chat.findOne({
                        $or: [{ user1: user.username }, { user2: user.username }]
                    });

                    if (!msg.message) {
                        msg.message = "";
                    }

                    const newMessage = {
                        sendingUser: user.username,
                        message: msg.message,
                        delivered: false
                    };

                    const destUserOnline = onlineUsers.find(
                        u => u.username === msg.destinationUser
                    );
                    if (destUserOnline) {
                        socket.broadcast
                            .to(destUserOnline.socketId)
                            .emit("chat",
                                {
                                    sendingUser: user.username,
                                    message: msg.message
                                }
                            );
                        console.log("WYSLANO do:" + destUserOnline.username);
                    }

                    if (!chat) {
                        chat = await new Chat({
                            user1: user.username,
                            user2: msg.destinationUser
                        });
                        chat.messages = {
                            sendingUser: user.username,
                            message: newMessage.message,
                            delivered: newMessage.delivered
                        };
                    } else {
                        chat.messages.push(newMessage);
                    }
                    chat.save().then(() => {
                        console.log("zapisano");
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
        */

        socket.on("usersList", async function (data) {
            console.log(data);
            if (data.left === true) {
                const removeIndex = onlineUsers.findIndex(u => u.username === data.username);
                if (removeIndex > -1) {
                    onlineUsers.splice(removeIndex, 1);
                }
            }
            if (user.username) {
                const registeredUsers = await User.find({});
                const userNamesWithStatus = [];
                registeredUsers.forEach(u => {
                    let isOnline = false;
                    if (onlineUsers.find(onlineUser => onlineUser.username === u.username)) {
                        isOnline = true;
                    }
                    userNamesWithStatus.push({
                        isOnline: isOnline,
                        username: u.username,
                        newMessages: 0
                    });
                });
                io.sockets.emit("usersList", userNamesWithStatus);
            }
        });

        socket.on("auction", function (data) {
            if (data.auctionId) {
                Auction.findById(data.auctionId).then(auction => {
                    if (auction && (auction.currentPrice < data.newPrice) && auction.endDate > Date.now()) {
                        auction.currentPrice = data.newPrice;
                        auction.userPrice.push({
                            user: socket.request.user.username,
                            price: data.newPrice
                        });
                        auction.save().then(auction => {
                            io.sockets.emit("auction", { auctionId: auction._id, newPrice: data.newPrice });
                        });
                    }
                });
            }
        });

        /*
        socket.on("newMessages", async function () {
            if (user.username) {
                const chats = await Chat.find({
                    $or: [
                        { user1: user.username },
                        { user2: user.username }
                    ]
                });
                const newMesseges = [];
                chats.forEach((chat, index) => {
                    chat.messages.forEach((mess, index, messages) => {
                        if (!mess.delivered && mess.sendingUser !== user.username) {
                            if (!newMesseges.find(m => m.sendingUser === mess.sendingUser)) {
                                newMesseges.push({
                                    sendingUser: mess.sendingUser,
                                    numberOfMessages: 1
                                });
                            } else {
                                const msgFromUser = newMesseges.findIndex(m => m.sendingUser === mess.sendingUser);
                                newMesseges[msgFromUser].numberOfMessages++;
                            }
                            messages[index] = mess;
                        }
                    });
                });
                chats.save();
                io.sockets.emit("newMessages", newMesseges);
            }
        }); */

        /*
        socket.on("chatSelected", async function (chatUser) {
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
    });

    return io;
};
