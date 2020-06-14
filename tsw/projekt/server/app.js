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
        secret: secret,
        resave: false,
        saveUninitialized: false
    })
);

const logger = require("morgan");
const errorHandler = require("errorhandler");

app.use(express.static(path.join(__dirname, "public")));

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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.set("trust proxy", 1);

// const server = require("./https")(app);

const serv = app.listen(port, () => {
    console.log(`Serwer dostępny na porcie ${port}`);
});

const passportSocketIo = require("passport.socketio");

const io = require("./sockets/sockets").listen(serv);

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: "express.sid",
    secret: secret,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

function onAuthorizeSuccess (data, accept) {
    console.log("Connected to socked.io");
    accept();
}

function onAuthorizeFail (data, message, error, accept) {
    if (error) {
        console.log("Error", error);
    }
    console.log("failed connection to socket.io:", message);
    if (error) {
        accept(new Error(message));
    }
}
