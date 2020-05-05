/* globals axios: false */
// https://github.com/axios/axios

let array = [];
/*
showData() {
    let button=document.getElementById("start");
    button.addEventListener("click",start);
}*/
//axios.defaults.withCredentials = true 

window.addEventListener("DOMContentLoaded", () => {
    let button=document.getElementById("start");
    button.addEventListener("click",start);
    let logButt=document.getElementById("log");
    logButt.addEventListener("click",log);
    let regButt=document.getElementById("register");
    regButt.addEventListener("click",register);
    let relogBut=document.getElementById("relog");
    relogBut.addEventListener("click",logOut);
})

log = () => {
    window.location.replace("https://localhost:3000/login");
}

register = () => {
    window.location.replace("https://localhost:3000/register");
}

getGames = () => {
    window.location.replace("https://localhost:3000/games");
}


logOut = () => {    
    axios.get('https://localhost:3000/logout').then(() =>{
        window.location.replace("https://localhost:3000/");
    }).then((resp) => {
            let relogBut=document.getElementById("relog");
            relogBut.innerText = "WYLOGOWNY";

        }
    )
}



/*global io: false */
"use strict";

// Inicjalizacja UI
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        const chatStatus	= document.getElementById("chatStatus");
        const newsStatus	= document.getElementById("newsStatus");
        const open	      = document.getElementById("open");
        const close	      = document.getElementById("close");
        const chatSend	  = document.getElementById("chatSend");
        const newsSend	  = document.getElementById("newsSend");
        const chatText 	  = document.getElementById("chatText");
        const newsText 	  = document.getElementById("newsText");
        const chatMessage	= document.getElementById("chatMessage");
        const newsMessage	= document.getElementById("newsMessage");
        const greenBullet = "img/bullet_green.png";
        const redBullet   = "img/bullet_red.png";

        let chat, news;

        close.disabled = true;
        chatSend.disabled = true;
        newsSend.disabled = true;
        // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
        open.addEventListener("click", () => {
            open.disabled = true;
            chat = io(`http://${location.host}/chat`);
            news = io(`http://${location.host}/news`);

            chat.on("connect", () => {
                close.disabled = false;
                chatSend.disabled = false;
                chatStatus.src = greenBullet;
                console.log("Nawiązano połączenie z kanałem „/chat”");
            });
            news.on("connect", () => {
                close.disabled = false;
                newsSend.disabled = false;
                newsStatus.src = greenBullet;
                console.log("Nawiązano połączenie z kanałem „/news”");
            });
            chat.on("disconnect", () => {
                open.disabled = false;
                chatStatus.src = redBullet;
                console.log("Połączenie z kanałem „/chat” zostało zakończone");
            });
            news.on("disconnect", () => {
                open.disabled = false;
                newsStatus.src = redBullet;
                console.log("Połączenie z kanałem „/news” zostało zakończone");
            });
            chat.on("message", (data) => {
                chatMessage.textContent = data;
            });
            news.on("message", (data) => {
                newsMessage.textContent = data;
            });
        });
        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener("click", () => {
            close.disabled = true;
            chatSend.disabled = true;
            newsSend.disabled = true;
            chatMessage.textContent = "";
            newsMessage.textContent = "";
            chat.disconnect();
            news.disconnect();
        });
        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        chatSend.addEventListener("click", () => {
            chat.emit("message", chatText.value);
            console.log(`Wysłałem wiadomość /chat: ${chatText.value}`);
            chatText.value = "";
        });
        newsSend.addEventListener("click", () => {
            news.emit("message", newsText.value);
            console.log(`Wysłałem wiadomość /news: ${newsText.value}`);
            newsText.value = "";
        });
    }
};
