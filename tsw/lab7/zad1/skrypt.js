
const zadanie1 = () => {   
    var node = document.createElement("li");  
    var listEl = document.createTextNode("Wsparcie telefoniczne 24/7"); 
    let el = document.getElementById("pro-plan");
    let cartBody = el.childNodes[3];
    cartBody.childNodes[3].appendChild(listEl);
    console.log(xd);
};


window.onload = () => {
    zadanie1();
};   


