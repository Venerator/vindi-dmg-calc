const bossstat = {
    lvl90raids: {
        def: 13000,
        res: 80
    },
    dullahan: {
        def: 18500,
        res: 105
    },
    aessidhe: {
        def: 20500,
        res: 105
    },
    arcana: {
        def: 20500,
        res: 108
    },
    rupacitus: {
        def: 21300,
        res: 114
    },
    claire: {
        def: 24000,
        res: 125
    },
    elchulus: {
        def: 26000,
        res: 127
    },
    macha: {
        def: 27000,
        res: 130
    },
    agares: {
        def: 28000,
        res: 131
    },
    lugh: {
        def: 28500,
        res: 132
    },
    special: {
        def: 26000,
        res: 127
    },
    neamhain: {
        def: 17000,
        res: 90
    },
    balor: {
        def: 23500,
        res: 123
    },
    hell: {
        def: 29000,
        res: 145
    }
}
function calc(){
    let boss;
    if(document.querySelector('select#boss').value == 'custom')
        boss = {
            def: document.querySelector('input#bossdef').value * 1,
            res: document.querySelector('input#bossres').value * 1
        };
    else
        boss = bossstat[document.querySelector('select#boss').value];
    let atk = document.querySelector('input#atk').value * 1;
    let add = document.querySelector('input#add').value * 1;
    let alr = document.querySelector('input#alr').value * 1;
    let bal = document.querySelector('input#bal').value * 1;
    let cri = document.querySelector('input#cri').value * 1;

    let att = Math.max(Math.min(10000 + alr, atk - boss.def), 0);
    let base;
    // if(att <= boss.def){
    //     let x = (att - def + 900) / (def + 900);
    //     let fx = 0.1856 + 0.5525 * x + 0.4214 * Math.pow(x , 2) - 0.3094 * Math.pow(x , 3) + 0.3643 * Math.pow(x , 4) - 0.2144 * Math.pow(x , 5);
    //     base = (def + 900) * fx;
    // }
    let x = (att + 900) / (boss.def + 900);
    let fx = 0.1856 + 0.5525 * x + 0.4214 * Math.pow(x , 2) - 0.3094 * Math.pow(x , 3) + 0.3643 * Math.pow(x , 4) - 0.2144 * Math.pow(x , 5);
    base = (boss.def + 900) * fx;

    let adm;
    if(att <= 3000)
        adm = 1.875;
    else if(att <= 10000)
        adm = 6.25 * att / 10000;
    else
        adm = 6.25 + (att - 10000) / 2400;

    let effcrit = Math.max(Math.min(50, cri - boss.res), 3);
    
    let nocritdmg = (base + add * adm) * (bal + 100) / 200;
    let critdmg = nocritdmg * (1.95 * (effcrit / 100) + 1 * ((100 - effcrit) / 100));

    document.querySelector('input#nocritdmg').value = Math.round(nocritdmg * 100) / 100;
    document.querySelector('input#critdmg').value = Math.round(critdmg * 100) / 100;
}