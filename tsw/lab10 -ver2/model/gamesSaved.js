const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");


const gameSchema = new Schema({
    userName: String,
    size: Number,
    dim: Number,
    max: Number,
    solution: [],
    moves:  [],
    movesLetf: Number,
    result: Boolean
});


const GameSaved = mongoose.model("Game", gameSchema);



module.exports = GameSaved;
