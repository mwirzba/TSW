const poKolei = (funTab, fcb) => {
   let callback =  arg =>  {
       if(funTab.length > 0){
           let fun = funTab[0];
           funTab.splice(0,1);
           fun(arg,callback);
       } else {
           fcb(arg);
       }
   }
   callback(2);
};


const fun1 = (arg,callback) => {
    console.log("Wywolano "+arg);
    arg = arg+1;
    callback(arg);
}

const fun2 = (arg,callback) => {
    console.log("Wywolano "+arg);
    arg = arg*2;
    callback(arg);
}

const fun3 = (arg,callback) => {
    console.log("Wywolano "+arg);
    arg = arg*2;
    callback(arg);
}

const resFun = (arg) => {
    console.log(`Wynikiem jest ${arg}`);
}



let callbacks = [fun1,fun2,fun3];


poKolei(callbacks,resFun);