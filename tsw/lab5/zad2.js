const groupMap = (tab,key,fun) => {
    let map =  new Map();  
    let tabTrue = [];
    let tabFalse = [];
    tab.map(el => {
       let res = key(el);
       if(res===true) {
        tabTrue.push(el);
       } else {
        tabFalse.push(el);
       }
    })

    //tabTrue.forEach(el => {el = fun(el); return el });

    console.log(tabTrue);


    tabTrue = tabTrue.map(el => {
        el = fun(el);
        return el;
    })


    
    tabFalse = tabFalse.map(el => {
        el = fun(el);
        return el;
    })

    map.set(true,tabTrue);
    map.set(false,tabFalse);

    return  map;
}


console.log(groupMap([3,2,4,4,3], n => n % 2 === 0, n => n + 1));