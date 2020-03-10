const odwracanie = (napis) => { 
    if(!napis) {
        throw  new Error("Brak argumentu")
    }
    let split = napis.split(" ");
    let wyniki = split.map(nap => {
        if(nap.length > 4){
               nap = nap.split("")
                        .reverse()
                        .join("");
               return nap;
            }
            return nap;
    });
    console.log(wyniki.toString());
}


odwracanie("Dzik jest dziki, dzik jest zły. Dzik ma bardzo ostre kły.");