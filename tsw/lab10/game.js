
class Game {
    /*
    constructor() {
        this.options = {
            size: 5,
            dim: 9,
            max: 0
        }
        this.solution = [];
        this.moves = [];
        this.movesLetf = 'inf';
    }*/
    constructor(options,solution,movesLetf) {
        this.options  = options,
        this.solution = solution;
        this.moves = [];
        this.movesLetf = movesLetf;
    }    
}

module.exports = Game;