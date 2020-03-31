
const zadanie4 = () => {   
    let el = document.getElementById("pro-plan");
    let textToChange = el.firstElementChild.nextElementSibling.firstElementChild;
    increaseNumberInTextByPercent(textToChange,0.5);


    el = document.getElementById("basic-plan");
    textToChange = el.firstElementChild.nextElementSibling.firstElementChild;
    increaseNumberInTextByPercent(textToChange,0.25);
};

const increaseNumberInTextByPercent = (text,percent) => {
    let number = text.textContent.match(/\d+/g).map(Number);
    number[0] = number[0]+number[0]*percent;
    text.textContent = text.textContent.replace(/[0-9]/g, '');
    let bold = number[0]+'';
    text.innerHTML = bold.bold() + text.innerHTML;
}


window.onload = () => {
    zadanie4();
};   


