const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");

const gameOptions =  new Schema({
    size: Number,
    dim: Number,
    max: Number
})

const gameSchema = new Schema({
    options: gameOptions,
    solution: [],
    moves:  [],
    movesLetf: Number,
    result: Boolean
});

const gamesSchema = new Schema({
    games: [gameSchema],
    userName: String
});

const GameSaved = mongoose.model("Game", gamesSchema);
const GameOptions = mongoose.model("GameOptions", gameOptions);
const GamesSaved = mongoose.model("GamesSaved", gamesSchema);


module.exports = {GamesSaved, GameSaved, GameOptions}
