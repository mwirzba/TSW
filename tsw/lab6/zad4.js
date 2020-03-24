const poKolei = (funTab, fcb) => {
    let rtnArray = [];
    let startLength = funTab.length;
    let callback = (err,arg) =>  {
        errorHandler(err);
        if(startLength>funTab.length)
                rtnArray.push(arg);
        if(funTab.length > 0) {   
            let fun = funTab[0];
            funTab.splice(0,1);       
            if(startLength===funTab.length+1) {
                fun(callback);
            } else {
                    fun(err,arg,callback)
            }
        } else {
            fcb(err,rtnArray);
        }
    }
    callback();
 };
 

 const fun1 = (callback) => {
    callback(null,4);
}

const fun2 = (err,result,callback) => {
    if(result !== undefined){
        result = result-2;
        if(result < 0) {
            err = "Wynik nie moze byc ujemny.";
            callback(err,undefined);
        } else {
            err = null;
            callback(err,result);
        }
    } else {
        callback(err,1);
    }
}

const fun3 = (err,result,callback) => {
    if(result !== undefined){
        result = result/3;
        if(result > 0 && result < 1) {
            err = "Wynik musi byc liczba calkowita dodatnią.";
            callback(err,undefined);
        } else {
            err = null;
            callback(err,result);
        }
    } else {
        callback(err,1);
    }
}

const errorHandler = (err) => {
    if(err != null) {
        console.log(err);
        //throw new Error(err);
    }
}

const fcb = (err,result) => {
    if  (err !== null) {
        console.log(`Wystapil blad: ${err}`);
    }
    console.log(`Wynik: ${result}`);
}



let callbacks =  [fun1,fun2,fun3];


poKolei(callbacks,fcb);