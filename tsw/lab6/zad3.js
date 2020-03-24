const poKolei = (funTab, fcb) => {
    let rtnArray = [];
    let startLength = funTab.length;
    let callback = arg =>  {
        if(startLength>funTab.length)
                rtnArray.push(arg);
        if(funTab.length > 0) {   
            let fun = funTab[0];
            funTab.splice(0,1);       
            if(startLength===funTab.length+1) {
                fun(callback);
            } else {
                    fun(arg,callback)
            }
        } else {
            fcb(rtnArray);
        }
    }
    callback();
 };
 

const fun1 = (callback) => {
    console.log("Wywolano ");
    callback(1);
}

const fun2 = (arg,callback) => {
    if(arg !== undefined){
        console.log("Wywolano "+arg);
        arg = arg-5;
        callback(arg);
    } else {
        callback(1);
    }
}

const fun3 = (arg,callback) => {
    if(arg !== undefined){
        console.log("Wywolano "+arg);
        arg = arg/2;
        callback(arg);
    }
    else {
        callback(1);
    }
}

const resFun = (arg) => {
    console.log(`Wynikiem jest ${arg}`);
}



let callbacks =  [fun1,fun2,fun3];


poKolei(callbacks,resFun);