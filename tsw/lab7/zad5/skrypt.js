
const init = () => {   
    var buttonPro = document.getElementById("butPro"); 
    var buttonBasic = document.getElementById("butBasic");
    buttonPro.addEventListener("click", setPricePro); 
    buttonBasic.addEventListener("click", setPriceBasic); 
};


const changePriceText = (textId,setYear) => {
    let el = document.getElementById(textId);
    let textToChange = el.firstElementChild.nextElementSibling.firstElementChild;
    if(setYear) {
        getYearPriceText(textToChange)
        return;
    }
    getMouthPriceText(textToChange);
}


const getYearPriceText = (text) => {
    let number = text.textContent.match(/\d+/g).map(Number);
    number[0] = (number[0]*10).toFixed(2);
    let bold = number[0]+'';
    text.innerHTML = bold.bold() + " zł netto / rok - " + (number[0]/12).toFixed(2) + " za miesiac!";
}

const getMouthPriceText = (text) => {
    let number = text.textContent.match(/\d+/g).map(Number);
    number[0] = (number[0]/10).toFixed(2);
    let bold = number[0]+'';
    text.innerHTML = bold + " zł netto / miesiac";
}


const changebuttonText = (el,toYearPrice)  => {
    if (toYearPrice) {
        el.innerText  = "Cena za miesiac";
    } else {
        el.innerText  = "Cena za rok";
    }
}


let toBasicYearPrice = true;
let toPremiumYearPrice = true;


const setPriceBasic = (el) => {
    changebuttonText(el.srcElement,toBasicYearPrice);
    changePriceText("basic-plan",toBasicYearPrice);
    toBasicYearPrice=!toBasicYearPrice;
}


const setPricePro = (el) => {
    changebuttonText(el.srcElement,toPremiumYearPrice);
    changePriceText("pro-plan",toPremiumYearPrice);
    toPremiumYearPrice=!toPremiumYearPrice;
}



window.onload = () => {
    init();
};   
