const poKolei = (funTab, fcb) => {
    let rtnArray = [];
    let startLength = funTab.length;
    let callback = (arg) => {
        console.log(arg);
        if(startLength>funTab.length) {
            if (arg === undefined) {
                rtnArray.push(undefined);
            }
            else {
                rtnArray.push(arg);
            }
        }
      
        if(funTab.length > 0) {   
            let fun = funTab[0];
            funTab.splice(0,1);          
            fun(callback);
        } else {
            fcb(rtnArray);
        }
    }
    callback();
 };
 

const add = (callback) => {
    callback(4);
}

const noRes = (callback) => {
    callback();
}

const sub = (callback) => {
    callback(5);
}

const resFun = (arg) => {
    console.log(`Wynikiem jest ${arg}`);
}



let callbacks =  [add,noRes,sub];



poKolei(callbacks,resFun);