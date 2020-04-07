
const init = () => {
    let headers = document.querySelectorAll(".hd");
    headers[0].nextElementSibling.hidden = true;
    headers[1].nextElementSibling.hidden = true;
    headers[2].nextElementSibling.hidden = false;
    headers[3].nextElementSibling.hidden = false;
    headers[4].nextElementSibling.hidden = true;
    Array.from(headers).forEach(onMouse)
}


const onMouse = (el) => {
    if(el.nextElementSibling.hidden===true) {
        el.onmouseover = function() {
            this.nextElementSibling.hidden = !this.nextElementSibling.hidden;
        };
        el.onmouseout  = function() {
            this.nextElementSibling.hidden = !this.nextElementSibling.hidden;
        };
    }
}


window.addEventListener('DOMContentLoaded',init);