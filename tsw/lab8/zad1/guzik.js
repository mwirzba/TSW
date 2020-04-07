
const setEvents = () => {
    let specButtons = document.getElementsByClassName("spec");    
    specButtons[0].addEventListener('click',add);
}


const add  = (el) => {
    let li = el.srcElement.parentElement;
    let copy =  li.cloneNode(true);
    console.log(copy);
    copy.firstChild = "nowy";
    let copyButton = copy.firstElementChild;
    copyButton.innerText = "spec";
    copyButton.addEventListener('click',add);
    li.parentElement.insertBefore(copy,li.nextSibling);
}


window.addEventListener('DOMContentLoaded',setEvents);
