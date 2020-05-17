const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const secret = process.env.APP_SECRET || "$uper $ecret";
const env = process.env.NODE_ENV || "development";
const path = require("path");

const session = require("express-session");

const bodyParser = require("body-parser");
const cors = require("cors");
app.use(require("cookie-parser")());

const logger = require("morgan");
const errorHandler = require("errorhandler");

app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: secret }));

const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const routes = require("./routes/route");

app.use(routes.router);

if (env === "development") {
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

const server = require("./https")(app);

const io = require("socket.io")(server);
/*, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "http:", // or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
}); */

io.on("connection", (socket) => {
    console.log("CONNECTED");
    socket.on("message", (msg) => {
        console.log("Wiadomisc");
        io.emit("message", msg);
    });
});

server.listen(port, () => {
    console.log(`Serwer dostępny na porcie ${port}`);
});

module.exports = app;
