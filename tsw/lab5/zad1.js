const groupBy = (tab,key) => {
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
    map.set(true,tabTrue);
    map.set(false,tabFalse);

    return  map;
}

console.log(groupBy([3,2,4,4,3], n => n % 2 === 0));