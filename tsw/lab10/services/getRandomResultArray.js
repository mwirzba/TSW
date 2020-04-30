module.exports = getRandomResultArray = (options) => {
    let solution = [];
    let i = 0;
    while(i < options.size) {
        solution.push(Math.floor((Math.random() * options.dim) + 1)); i++;
    }
    return solution;
}