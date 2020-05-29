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
                $or: [
                    { $and: [{ user1: user.username }, { user2: msg.destinationUser }] },
                    { $and: [{ user1: msg.destinationUser }, { user2: user.username }] }
                ]
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
                    console.log(chat);
                } else {
                    chat.messages.push(newMessage);
                }
                console.log(chat);
                await chat.save();
            } catch (e) {
                console.log(e);
            }
        });

        socket.on("usersList", async function (data) {
            console.log(data);
            if (data.left === true) {
                const removeIndex = onlineUsers.findIndex(u => u.username === socket.request.user.username);
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
                    if (auction.endDate < Date.now() || auction.archived) {
                        auction.archived = true;
                        auction.save().then(auction => {
                            socket.emit("auction", { auctionId: auction._id, error: "Aukcja już się zakończyła" });
                        });
                    } else if (auction && (auction.currentPrice < data.newPrice) && auction.endDate > Date.now()) {
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
    });

    return io;
};
