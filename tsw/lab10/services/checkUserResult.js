module.exports = checkUserResult = (req,game) => {
    let solution =  game.solution;
    let userSolution = req.body.array;
    let rtn = {
        white: 0,
        black: 0
    }
    let equal = true;
    for (let index = 0; index < userSolution.length; index++) {
        if( userSolution[index] === solution[index]){
            rtn.black++;
        }
        if(solution.filter(d => d ===  userSolution[index]).length > 0) {
            rtn.white++;
        }
        if( userSolution[index] !==  solution[index]){
            equal= false;
        }
    }
    if (equal) { 
        return equal;
    }
    if(game.movesLetf === 0) {
        return false;
    }
    return rtn;
}
