
const zadanie3 = () => {   
    let el = document.getElementById("pro-plan");
    let button = el.lastElementChild.lastElementChild;
    button.style["background-color"] = "red";
    button.style["color"] = "white";
    button.innerHTML = "Kup teraz";
};


window.onload = () => {
    zadanie3();
};   


