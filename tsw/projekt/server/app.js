const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const secret = process.env.SECRET || "$uper $ecret";
const env = process.env.NODE_ENV || "development";


const bodyParser = require('body-parser');
const cors = require('cors');


const logger = require("morgan");
const errorHandler = require("errorhandler");


const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const routes = require("./routes/route");

app.use(routes.router);


const path = require("path");
app.use(express.static(path.join(__dirname, "public")));


if ("development" === env) {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

app.use((req, res) => {
    res.status(404).json({
        error: `Niepoprawne żądanie: ${req.method} ${req.originalUrl}`
    });
});



//const server = require("./https")(app);



app.listen(port, () => {
    console.log(`Serwer dostępny na porcie ${port}`);
});

module.exports = app;

