const poKolei = (fun1, fun2,callback)  => {
    let y = 1
    fun1(y,(res) => {
        fun2(res,(x) =>{
            callback(x);
        });  
    });
}

const fun1 = (arg,callback) => {
    let result = arg + 2;
    //console.log("fun1 " + result);
    callback(result);
}


const fun2  = (arg,callback) => {
    //console.log("fun2")
    let result = arg * 3;
    callback(result);
}


const callback  = (arg) => {
    console.log("Wynikiem jest:" + arg);
}

