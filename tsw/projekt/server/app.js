const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const secret = process.env.APP_SECRET || "$uper $ecret";
const env = process.env.NODE_ENV || "development";
const path = require("path");

const session = require("express-session");

const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const MemoryStore = require("memorystore")(session);
const store = new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
});

app.use(
    session({
        key: "express.sid",
        store: store,
        secret: secret
    })
);

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

const passportSocketIo = require("passport.socketio");


io.use(passportSocketIo.authorize({
    cookieParser: cookieParser, // the same middleware you registrer in express
    key: "express.sid", // the name of the cookie where express/connect stores its session_id
    secret: secret, // the session_secret to parse the cookie
    store: store, // we NEED to use a sessionstore. no memorystore please
    success: onAuthorizeSuccess, // *optional* callback on success - read more below
    fail: onAuthorizeFail // *optional* callback on fail/error - read more below
}));

function onAuthorizeSuccess (data, accept) {
    console.log("successful connection to socket.io");

    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    // accept(null, true);

    // OR

    // If you use socket.io@1.X the callback looks different
    accept();
}

function onAuthorizeFail (data, message, error, accept) {
    if (error) {
        throw new Error(message);
    }
    console.log("failed connection to socket.io:", message);

    // We use this callback to log all of our failed connections.
    // accept(null, false);

    // OR

    // If you use socket.io@1.X the callback looks different
    // If you don't want to accept the connection
    if (error) {
        accept(new Error(message));
    }
    // this error will be sent to the user as a special error-package
    // see: http://socket.io/docs/client-api/#socket > error-object
}

io.on("connection", (socket) => {
    console.log("PODLACZONO");
    socket.on("chat", (msg) => {
        socket.emit("chat", msg);
    });
});

server.listen(port, () => {
    console.log(`Serwer dostępny na porcie ${port}`);
});

module.exports = { server, cookieParser, secret, session, store };
