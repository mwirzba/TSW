
class Game {
    constructor() {
        this.options = {
            size: 5,
            dim: 9,
            max: 0
        }
        this.solution = [];

        this.random = () => {
            this.solution = [];
            let i = 0;
            while(i < this.options.size) {
                this.solution.push(Math.floor((Math.random() * this.options.dim) + 1))
                i++
            }
        }
    }   
}

module.exports.Game = Game;