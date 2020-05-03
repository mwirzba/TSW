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
    let prevGames=document.getElementById("prevGames");
    prevGames.addEventListener("click",getGames);
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



send = () => {
    let msg = document.getElementById("inputText").value
    let tab = msg.split(' ').map(x=>+x);
    let req = {
        array: tab,
        uuid: document.cookie
    }
    let plansza = document.getElementById("plansza");
    plansza.innerHTML = plansza.innerHTML + "<br/>" + tab + "<br/>";
    axios.patch('https://localhost:3000/',req)
    .then((resp) => {
        let odpowiedz = document.getElementById("odpowiedz");
        if(resp.data.comp === true) {
            odpowiedz.innerHTML = "<br/>WYGRALES";
            let inputText = document.getElementById("inputText")
            inputText.remove();
            let sendbutton=document.getElementById("send");
            sendbutton.remove();
        }     
        else if(resp.data.comp === false) {
            odpowiedz.innerHTML = "<br/>PRZEGRALES";
            let inputText = document.getElementById("inputText")
            inputText.remove();
            let sendbutton=document.getElementById("send");
            sendbutton.remove();
        }
        else
            odpowiedz.innerHTML = "BIALE: " +  resp.data.comp.white + " CZARNE: " + resp.data.comp.black 
            + ' POZOSTALE RUCHY: ' + resp.data.movesLeft;
    }).catch((err) => {
        window.location.replace("https://localhost:3000/login");
    });
}


const start = () => {
    let size = document.getElementById("size").value;
    let dim = document.getElementById("dim").value;
    let max = document.getElementById("max").value;

    let button=document.getElementById("start");

    button.style.visibility = 'hidden';
    axios.post('https://localhost:3000/', {
        size: size,
        dim: dim,
        max: max
    })
    .then((resp) => {
        if(resp === 401) {
            window.location.replace("https://localhost:3000/login");
        }
        let form = document.getElementById("form");
        form.remove();
        let plansz = document.getElementsByClassName("plansz")
        
        let plansza = document.createElement('div');
        plansza.className = "plansza";
        plansza.id = "plansza";
        let odp = document.createElement('div');
        odp.className = "odpowiedz";
        odp.id = "odpowiedz";

        let input = document.createElement('input');
        input.setAttribute("type", "text");
        input.id = "inputText";

        let button = document.createElement('button');
        button.id = "send";
        button.textContent ="WYSLIJ";

        
        plansz[0].appendChild(plansza);
        plansz[0].appendChild(odp);
        plansz[0].appendChild(input);
        plansz[0].appendChild(button);

        let sendbutton=document.getElementById("send");
        sendbutton.addEventListener("click",send);

        console.log("Odpowiedź serwera na POST /mmind:");
        console.dir(resp.data);
        let size = resp.data.game.size;
        let dim = resp.data.game.dim;
        let max = resp.data.game.max;
        document.cookie = resp.data.uuid
        odp.innerText = 'Size: ' + size +  ' Dim: ' + dim + ' Max: ' + max;
    }).catch(error => {
        console.log(error);
    });;

    
}