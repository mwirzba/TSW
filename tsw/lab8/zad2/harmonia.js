
const init = () => {
    let headers = document.querySelectorAll(".hd");
    Array.from(headers).forEach(onClickShow)
}


const onClickShow = (el) => {
    el.onclick  = function() {
        this.nextElementSibling.hidden = !this.nextElementSibling.hidden;
    };
}


window.addEventListener('DOMContentLoaded',init);