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
})

send = () => {
    let msg = document.getElementById("inputText").value
    let tab = msg.split(' ').map(x=>+x);
    let req = {
        array: tab,
        uuid: document.cookie
    }
    let plansza = document.getElementById("plansza");
    plansza.innerHTML = plansza.innerHTML + tab + "<br />";
    axios.patch('http://localhost:3000/mmind',req)
    .then((resp) => {
        let odpowiedz = document.getElementById("odpowiedz");
        if(resp.data.comp === true) {
            odpowiedz.innerText = "WYGRALES";
            let inputText = document.getElementById("inputText")
            inputText.remove();
            let sendbutton=document.getElementById("send");
            sendbutton.remove();
        }     
        else if(resp.data.comp === false) {
            odpowiedz.innerText = "PRZEGRALES";
            let inputText = document.getElementById("inputText")
            inputText.remove();
            let sendbutton=document.getElementById("send");
            sendbutton.remove();
        }
        else
            odpowiedz.innerHTML = "BIALE: " +  resp.data.comp.white + " CZARNE: " + resp.data.comp.black 
            + 'POZOSTALE RUCHY: ' + resp.data.movesLeft;
    });
}


start = () => {
    let size = document.getElementById("size").value;
    let dim = document.getElementById("dim").value;
    let max = document.getElementById("max").value;

    let button=document.getElementById("start");

    button.style.visibility = 'hidden';
    axios.post('http://localhost:3000/mmind', {
        size: size,
        dim: dim,
        max: max
    })
    .then((resp) => {
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
    });
    
}










