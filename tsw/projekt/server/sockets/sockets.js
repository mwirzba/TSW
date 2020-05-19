import chat from "../../src/components/chat/chat";

const Message = require("../models/message").Message;
const Chat = require("../models/chat");
const socket = require("socket.io");
const User = require("../models/user");

module.exports.listen = (server) => {
    const io = socket(server);
    let onlineUsers = [];

    io.on("connection", (socket) => {
        let user;
        const registeredUsers = User.find({});
        if (socket.request.user) {
            user = { username: socket.request.user.username, userId: socket.request.user.id, socketId: socket.id };
            onlineUsers.push(user);
        }

        console.log("PODLACZONO DO CZATU: " + user.username);
        socket.on("chat", async (msg) => {
            const destUserInDb = await User.findOne({ username: msg.destinationUser });
            if (!destUserInDb) {
                socket.emit("chat", "No user found with given user name.");
            } else {
                let chat = await Chat.findOne({ $or: [{ user1: user.username }, { user2: user.username }] });
                const chats = await Chat.find({});
                console.log(chats.length);

                if (!chat) {
                    console.log("NOWE");
                    chat = new Chat({
                        user1: user.username,
                        user2: msg.destinationUser
                    });
                }

                if (!msg.message) {
                    msg.message = "";
                }

                const newMessege = {
                    sendingUser: user.username,
                    message: msg.message,
                    delivered: false
                };

                const destUserOnline = onlineUsers.find(u => u.username === msg.destinationUser);
                if (destUserOnline) {
                    console.log("wysłano");
                    socket.broadcast.to(destUserOnline.socketId).emit("chat", [user.username + ": " + msg.message]);
                    newMessege.delivered = true;
                    chat.messages.push(newMessege);
                } else {
                    chat.messages.push(newMessege);
                }
                console.log("ZAPISANO");
                const saved = await chat.save();
                console.log(saved);
            }
        });

        socket.on("newMessages", async () => {
            if (user.username) {
                const chats = await Chat.find({ $or: [{ user1: user.username }, { user2: user.username }] });
                const newMesseges = [];
                chats.forEach((chat, index) => {
                    chat.messages.forEach((mess, index, messages) => {
                        if (!mess.delivered) {
                            newMesseges.push([mess.sendingUser + ": " + mess.message]);
                            mess.delivered = true;
                            messages[index] = mess;
                        }
                    });
                });
                chats.save();
                io.sockets.emit("chat", newMesseges);
            }
        });

        socket.on("disconnect", () => {
            onlineUsers = onlineUsers.filter(u => u.username === socket.request.user.username);
        });
    });

    return io;
};
