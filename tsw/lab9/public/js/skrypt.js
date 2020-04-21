/* globals axios: false */
// https://github.com/axios/axios

window.addEventListener("DOMContentLoaded", () => {
    console.log("Tutaj znajdzie się obsługa interfejsu gry!");

    // przykład użycia biblioteki axios:
    axios.post("/mmind", {
        size: 5,
        dim: 9,
        max: 20
    })
        .then((resp) => {
            console.log("Odpowiedź serwera na POST /mmind:");
            console.dir(resp.data);
        });
});
