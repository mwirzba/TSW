const mongoose = require("../mongoose/index");
const messageSchema = require("./message").messageSchema;
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    messages: [messageSchema]
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
