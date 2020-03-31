const zadanie2 = () => {   
    let el = document.getElementsByTagName("body");
    let cartBody = el[0].firstElementChild.firstElementChild;
    cartBody.insertBefore(cartBody.lastElementChild,cartBody.firstElementChild);
    console.log(cartBody)
};


window.onload = () => {
    zadanie2();
};   


