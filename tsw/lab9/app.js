
// ładujemy wykorzystywane moduły:


// express – jako „podstawa aplikacji”
const express = require("express");
// cookie-session – w sesji zapamiętamy identyfikator rozgrywki
const cookieSession = require("cookie-session");
// drobiazgi do sprawnego i czytelnego logowania
const logger = require("morgan");
const errorHandler = require("errorhandler");

// parametry – ewentualnie przekazywane poprzez zmienne środowiskowe
const port = process.env.PORT || 3000;
const secret = process.env.SECRET || "$uper $ecret";
const env = process.env.NODE_ENV || "development";

const cors = require('cors');

// tworzymy i konfigurujemy obiekt aplikacji
const app = express();

app.use(cors());

// obsługa danych typu application/json
app.use(express.json());
// obsługa sesji za pomocą ciasteczek
app.use(cookieSession({secret: secret}));

const path = require("path");
app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));


// middleware do kompilacji SCSS -> CSS
const sass = require("node-sass-middleware");
app.use(sass({
    src: path.join(__dirname, "/src"),
    dest: path.join(__dirname, "/public"),
    debug: true,
    outputStyle: "compressed",
}));




// główny „serwer statyczny”
app.use(express.static(path.join(__dirname, "public")));

// w zależności od trybu działania wybieramy odpowiedni poziom logowania
if ("development" === env) {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}

// importujemy obsługę zapytań
const routes = require("./routes");

// i „podłączamy” ją pod adres „/mmind”
app.use("/mmind", routes);

// przechwytujemy niepoprawne odwołania do serwera
app.use((req, res) => {
    res.status(404).json({
        error: `Niepoprawne żądanie: ${req.method} ${req.originalUrl}`
    });
});


// uruchamiamy serwer z aplikacją
app.listen(port, () => {
    console.log(`Serwer gry dostępny na porcie ${port}`);
});



