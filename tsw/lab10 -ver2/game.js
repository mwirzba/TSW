
class Game {
    constructor(options,solution,movesLetf) {
        this.options  = options,
        this.solution = solution;
        this.moves = [];
        this.movesLetf = movesLetf;
        this.result = false;
    }    
}

module.exports = Game;