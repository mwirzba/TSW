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
    let sendbutton=document.getElementById("send");
    sendbutton.addEventListener("click",send);
})

send = () => {
    let msg = document.getElementById("inputText").value
    let tab = msg.split(' ');
    let req = {
        array: tab
    }
    let plansza = document.getElementById("plansza");
    plansza.innerHTML = plansza.innerHTML + tab + "<br />";
    axios.patch('http://localhost:3000/mmind',req)
    .then((resp) => {
        console.log(resp)
        let odpowiedz = document.getElementById("odpowiedz");
        if(resp.data.comp === true)
            odpowiedz.innerText = "WYGRALES";
        else if(resp.data.comp === false)
            odpowiedz.innerText = "PRZEGRALES";
        else
            odpowiedz.innerHTML = "BIALE: " +  resp.data.comp.white + " CZARNE: " + resp.data.comp.black 
            + 'POZOSTALE RUCHY: ' + resp.data.moves;
    });
}


start = () => {
    let size = document.getElementById("size").value;
    let dim = document.getElementById("dim").value;
    let max = document.getElementById("max").value;

    let button=document.getElementById("start");
    let odp=document.getElementById("odpowiedz");

    button.style.visibility = 'hidden';
    axios.post('http://localhost:3000/mmind', {
        size: size,
        dim: dim,
        max: max
    })
    .then((resp) => {
        let form = document.getElementById("form");
        form.remove();
        form = document.getElementsByClassName("plansz")
        form[0].style.visibility = "visible"

        console.log("Odpowiedź serwera na POST /mmind:");
        console.dir(resp.data);
        let size = resp.data.game.size;
        let dim = resp.data.game.dim;
        let max = resp.data.game.max;
        odp.innerText = 'Size: ' + size +  ' Dim: ' + dim + ' Max: ' + max;
    });
    
}








