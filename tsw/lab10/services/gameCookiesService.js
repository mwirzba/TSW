const addUserGameToCookies = (req,game,uuid) => {
    if(!req.games) {
        let games = {};
        req.session.games = games;
    }
    let games =  req.session.games;
    games[uuid] = game;
    req.session.games = games;
}

const getUserGameFromCookies = (req) => {
    if(!req.session.games) {
        console.log("PUSTO BRAK GIER")
    } else {
        let games = req.session.games;
        let game = games[req.body.uuid];
        return game;
    }
}

const addNewMoveToUserGame = (req) => {
    if(!req.session.games) {
        console.log("PUSTO BRAK GIER")
    } else {
        let games =  req.session.games;
        let game = games[req.body.uuid];
        game.moves.push(req.body.array)
        if(game.movesLetf != 'inf') {
            game.movesLetf--;
        }
        games[req.body.uuid] = game;
        req.session.games = games;
    }
} 

const removeUserGame = (req) => {
    if(!req.session.games) {
        console.log("PUSTO BRAK GIER")
    } else {
        let games = req.session.games;
        if(games.hasOwnProperty(req.body.uuid)) {
            delete games[req.body.uuid];
            req.session.games = games;
        }
    }
}

module.exports = { 
    addUserGameToCookies: addUserGameToCookies,
    getUserGameFromCookies: getUserGameFromCookies,
    addNewMoveToUserGame: addNewMoveToUserGame,
    removeUserGame: removeUserGame
};