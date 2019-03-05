const bossstat = {
    lvl90raids: {
        def: 13000,
        res: 80,
        dongsukres: 0,
        dongsukmindmg: 100
    },
    dullahan: {
        def: 18500,
        res: 105,
        dongsukres: 0,
        dongsukmindmg: 100
    },
    aessidhe: {
        def: 20500,
        res: 105,
        dongsukres: 0,
        dongsukmindmg: 100
    },
    arcana: {
        def: 20500,
        res: 108,
        dongsukres: 0,
        dongsukmindmg: 100
    },
    rupacitus: {
        def: 21300,
        res: 114,
        dongsukres: 0,
        dongsukmindmg: 100
    },
    claire: {
        def: 24000,
        res: 125,
        dongsukres: 5,
        dongsukmindmg: 30
    },
    elchulus: {
        def: 26000,
        res: 127,
        dongsukres: 10,
        dongsukmindmg: 20
    },
    macha: {
        def: 27000,
        res: 130,
        dongsukres: 30,
        dongsukmindmg: 10
    },
    agares: {
        def: 28000,
        res: 131,
        dongsukres: 40,
        dongsukmindmg: 10
    },
    lugh: {
        def: 28500,
        res: 132,
        dongsukres: 45,
        dongsukmindmg: 10
    },
    special: {
        def: 26000,
        res: 127,
        dongsukres: 20,
        dongsukmindmg: 10
    },
    neamhain: {
        def: 17000,
        res: 90,
        dongsukres: 0,
        dongsukmindmg: 100
    },
    balor: {
        def: 23500,
        res: 123,
        dongsukres: 0,
        dongsukmindmg: 100
    },
    hell: {
        def: 29000,
        res: 145,
        dongsukres: 0,
        dongsukmindmg: 100
    }
}

function exec() {
    target = event.target.parentElement.parentElement;

    let boss;
    if(document.querySelector('select#boss').value == 'custom')
        boss = {
            def: document.querySelector('input#bossdef').value * 1,
            res: document.querySelector('input#bossres').value * 1,
            dongsukres: document.querySelector('input#bossdongsukres').value * 1,
            dongsukmindmg: document.querySelector('input#bossdongsukmindmg').value * 1
        };
    else
        boss = bossstat[document.querySelector('select#boss').value];
    let atk = target.querySelector('input#atk').value * 1;
    let add = target.querySelector('input#add').value * 1;
    let alr = target.querySelector('input#alr').value * 1;
    let bal = target.querySelector('input#bal').value * 1;
    let cri = target.querySelector('input#cri').value * 1;
    let dongsuk = target.querySelector('input#dongsuk').value * 1;

    dmg = calcdmg(boss, atk, add, alr, bal, cri, dongsuk);
    

    target.querySelector('input#nocritdmg').value = Math.round(dmg[0] * 100) / 100;
    target.querySelector('input#critdmg').value = Math.round(dmg[1] * 100) / 100;
}

function calcdmg(boss, atk, add, alr, bal, cri, dongsuk) {
    let att = Math.max(Math.min(10000 + alr, atk - boss.def), 0);
    let base;
    if(att <= (boss.def * 2)){
        let x = (att + 900) / (boss.def + 900);
        let fx = 0.1856 + 0.5525 * x + 0.4214 * Math.pow(x , 2) - 0.3094 * Math.pow(x , 3) + 0.3643 * Math.pow(x , 4) - 0.2144 * Math.pow(x , 5);
        base = (boss.def + 900) * fx;
    } else {
        base = (boss.def + 900) + (att-2 * boss.def);
    }

    let adm;
    if(att <= 3000)
        adm = 1.875;
    else if(att <= 10000)
        adm = 6.25 * att / 10000;
    else
        adm = 6.25 + (att - 10000) / 2400;

    let effcrit = Math.max(Math.min(50, cri - boss.res), 3);
    
    let nocritdmg = (base + add * adm) * (bal + 100) / 200;
    if(boss.dongsukres > 0){
        let ddm = Math.max(Math.min(dongsuk - boss.dongsukres, 100), boss.dongsukmindmg) / 100;
        nocritdmg = nocritdmg * ddm;
    }

    let critdmg = nocritdmg * (1.95 * (effcrit / 100) + 1 * ((100 - effcrit) / 100));
    
    return [nocritdmg, critdmg];
}

function compare() {
    let critdmg1 = document.querySelector('#calc1 input#critdmg').value * 1;
    let critdmg2 = document.querySelector('#calc2 input#critdmg').value * 1;
    let inputdeal1 = document.querySelector('#compare #input input#deal1').value * 1;
    let inputdeal2 = document.querySelector('#compare #input input#deal2').value * 1;

    let samespecdeal1 = inputdeal1 * 100000 / critdmg1;
    let samespecdeal2 = inputdeal2 * 100000 / critdmg2;

    let outputdeal1 = samespecdeal1 / (samespecdeal1 + samespecdeal2) * 100;
    let outputdeal2 = samespecdeal2 / (samespecdeal1 + samespecdeal2) * 100;

    document.querySelector('#compare #output input#deal1').value = Math.round(outputdeal1 * 100) / 100;
    document.querySelector('#compare #output input#deal2').value = Math.round(outputdeal2 * 100) / 100;
}
