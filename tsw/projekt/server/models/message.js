const mongoose = require("../mongoose/index");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sendingUser: { type: String, required: true },
    destinationUser: { type: String, required: true },
    message: { type: String, required: true },
    delivered: { type: Boolean, require: true }
});

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
