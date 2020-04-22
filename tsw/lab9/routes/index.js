"use strict";

// Sugestia – funkcję oceniającą ruchy najlepiej
// umieścić w osobnym module, a poniżej jedynie z niej
// skorzystać.

const gameFile = require("./../game");
const express = require("express");
const router = express.Router();
const game = new gameFile.Game();
const uuid = require("uuidv4").uuid;

const checkUserResult = (userRes,game,leftMoves) => {
    let correctResult = game;
    let intArray = userRes.array;
    let rtn = {
        white: 0,
        black: 0
    }
    let equal = true;
    for (let index = 0; index < intArray.length; index++) {
        if( parseInt(intArray[index]) === correctResult[index]){
            rtn.black++;
        }
        if(correctResult.filter(d => d ===  parseInt(intArray[index])).length > 0) {
            rtn.white++;
        }
        if( parseInt(intArray[index]) !==  correctResult[index]){
            equal= false;
        }
    }
    if (equal) {
        return equal;
    }
    if(leftMoves === 0) {
        return false;
    }
    return rtn;
}


router.route("/")
    .post((req, res) => {
        const reqBody =  req.body;
        if(reqBody.size) {
            game.options.size = parseInt(reqBody.size);
        }
        if(reqBody.dim) {
            game.options.dim = parseInt(reqBody.dim);
        }
        if(reqBody.max) {
            game.options.max = parseInt(reqBody.max); 
        }
        game.random();
        console.log(game.options);
        req.session.solution = game.solution;
        if(game.options.max >0) {
            req.session.moves = game.options.max;
        }
        req.session.id = uuid;
        let rtn = {
            game: game.options,
            uuid: uuid(),
            e: req.session.solution
        }
        console.log("Sesja:"); console.log(req.session);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(rtn); 
    })
    .patch((req, res) => {
        let ruch = req.body;
        let solution = req.session.solution;
        let moves = "BEZ OGRENICZEN";
        if(req.session.moves !== undefined) {
            console.log("SORDSDF");
            req.session.moves = req.session.moves-1;
            moves = req.session.moves
        }
        console.log("Solucion");
        console.log(req.session.moves);
        let comp = checkUserResult(ruch,solution,moves);
        console.log(comp);
        res.json({
            moves,
            msg: "ocena ruchu",
            comp: comp
        });
    });

    

module.exports = router;
