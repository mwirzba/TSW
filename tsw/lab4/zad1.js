const telefon = (tab) => {

    if(!tab)
    {
        throw  new Error("Brak argumentu")
    }
    const originalLenght = tab.length;
    console.log(originalLenght)
    if(originalLenght !== 9)
    {
        throw new Error("Zla dlugosc tablicy");
    }
    const filetredAray = tab.filter( (f) => { return typeof f === 'number' && f.toString(10).length === 1 })
    console.log(filetredAray.length)
    if(originalLenght !== filetredAray.length)
    {
        throw new Error("podane argumenty nie sa liczbami w zakresie 0-9");
    }

    let rtn = "+48 ";
    let numbersInString = tab.join("");
    let chuncks = numbersInString.match(/.{1,3}/g);
    let joined = chuncks.join("-");
    return rtn + joined;
}


console.log(telefon([3,2,4,4,3,3,9,8,1]]));

/*
if(isNaN(f) && f.lenght === 1){
    console.log(f);
    return true;
}
return false;*/