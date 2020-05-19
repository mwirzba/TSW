const Message = require("../models/message");
const socket = require("socket.io");

module.exports.listen = (server) => {
    const io = socket(server);
    let onlineUsers = [];

    io.on("connection", (socket) => {
        let user;

        if (socket.request.user) {
            user = { username: socket.request.user.username, userId: socket.request.user.id, socketId: socket.id };
            onlineUsers.push(user);
        }

        console.log("PODLACZONO DO CZATU: " + user.username);
        socket.on("chat", (msg) => {
            console.log("WIAFOMDF");
            if (user.username) {
                const messageToSave = new Message({
                    sendingUser: user.username,
                    message: msg.message,
                    destinationUser: msg.destinationUser
                });
                const destUser = onlineUsers.find(u => u.username === msg.destinationUser);
                if (destUser) {
                    socket.broadcast.to(destUser.socketId).emit("chat", [user.username + ": " + msg.message]);
                }
                messageToSave.save();
            }
        });

        socket.on("newMessages", () => {
            if (user.username) {
                Message.find({ destinationUser: user.username }, (err, msg) => {
                    const newMesseges = [];
                    if (err) {
                        console.log(err);
                    } else {

                    }
                    msg.forEach((message) => {
                        const rtn = { sendingUser: message.sendingUser, message: msg.message };
                        newMesseges.push(rtn);
                    });
                    Message.remove({});
                    io.sockets.emit("chat", newMesseges);
                });
            }
        });

        socket.on("disconnect", () => {
            onlineUsers = onlineUsers.filter(u => u.username === socket.request.user.username);
        });
    });

    return io;
};
