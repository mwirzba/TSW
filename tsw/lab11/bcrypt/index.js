const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

// UWAGA! poniżej wykorzystujemy metody synchroniczne bcrypt
const hash = (pswd) => {
    return bcrypt.hashSync(pswd, salt);
};

const compare = (pswd, hash) => {
    return bcrypt.compareSync(pswd, hash);
};

module.exports = {
    hash,
    compare
};
