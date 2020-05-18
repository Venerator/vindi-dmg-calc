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
        def: 23000,
        res: 125,
        dongsukres: 5,
        dongsukmindmg: 30
    },
    elchulus: {
        def: 24000,
        res: 127,
        dongsukres: 10,
        dongsukmindmg: 20
    },
    macha: {
        def: 25000,
        res: 130,
        dongsukres: 30,
        dongsukmindmg: 10
    },
    agares: {
        def: 26000,
        res: 131,
        dongsukres: 40,
        dongsukmindmg: 10
    },
    lugh: {
        def: 26500,
        res: 132,
        dongsukres: 45,
        dongsukmindmg: 10
    },
    selren: {
        def: 27000,
        res: 132,
        dongsukres: 50,
        dongsukmindmg: 10
    },
    marject: {
        def: 27000,
        res: 132,
        dongsukres: 50,
        dongsukmindmg: 10
    },
    aodhan: {
        def: 27600,
        res: 136,
        dongsukres: 50,
        dongsukmindmg: 10
    },
    caesar: {
        def: 29000,
        res: 145,
        dongsukres: 55,
        dongsukmindmg: 10
    },
    special: {
        def: 24000,
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
    brigit: {
        def: 30000,
        res: 150,
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

function exec(num) {
    target = event.target.parentElement.parentElement;

    let boss;
    if (document.querySelector('select#boss').value == 'custom')
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
    let swordl;
    let spearl;
    if (num == 1) {
        swordl = document.querySelector('#swordl1').checked;
        spearl = document.querySelector('#spearl1').checked;
    } else if (num == 2) {
        swordl = document.querySelector('#swordl2').checked;
        spearl = document.querySelector('#spearl2').checked;
    }

    dmg = calcdmg(boss, atk, add, alr, bal, cri, dongsuk, swordl, spearl);


    target.querySelector('input#nocritdmg').value = Math.round(dmg[0] * 100) / 100;
    target.querySelector('input#critdmg').value = Math.round(dmg[1] * 100) / 100;
}

function calcdmg(boss, atk, add, alr, bal, cri, dongsuk, swordl, spearl) {
    let att = Math.max(Math.min(10000 + alr, atk - boss.def), 0);
    let base;
    if (att <= (boss.def * 2)) {
        let x = (att + 900) / (boss.def + 900);
        let fx = 0.1856 + 0.5525 * x + 0.4214 * Math.pow(x, 2) - 0.3094 * Math.pow(x, 3) + 0.3643 * Math.pow(x, 4) - 0.2144 * Math.pow(x, 5);
        base = (boss.def + 900) * fx;
    } else {
        base = (boss.def + 900) + (att - 2 * boss.def);
    }

    let adm;
    if (att <= 3000)
        adm = 1.875;
    else if (att <= 10000)
        adm = 6.25 * att / 10000;
    else
        adm = 6.25 + (att - 10000) / 2400;

    let effcrit;
    if (swordl) effcrit = Math.max(Math.min(65, cri + 15 - boss.res), 3);
    else if (spearl) effcrit = Math.max(Math.min(65, cri + 22 - boss.res), 3);
    else effcrit = Math.max(Math.min(50, cri - boss.res), 3);

    let nocritdmg = (base + add * adm) * (bal + 100) / 200;
    if (boss.dongsukres > 0) {
        let ddm = Math.max(Math.min(dongsuk - boss.dongsukres, 100), boss.dongsukmindmg) / 100;
        nocritdmg = nocritdmg * ddm;
    }

    let critdmg;
    if (swordl) critdmg = nocritdmg * (2.25 * (effcrit / 100) + 1 * ((100 - effcrit) / 100));
    else critdmg = nocritdmg * (1.95 * (effcrit / 100) + 1 * ((100 - effcrit) / 100));

    return [nocritdmg, critdmg];
}

function compare() {
    let comptype;
    if (document.querySelector('#compcrit').checked) comptype = 'crit';
    else if (document.querySelector('#compnocrit').checked) comptype = 'nocrit';

    let dmg1, dmg2;
    if (comptype == 'crit') {
        dmg1 = document.querySelector('#calc1 input#critdmg').value * 1;
        dmg2 = document.querySelector('#calc2 input#critdmg').value * 1;
    } else if (comptype == 'nocrit') {
        dmg1 = document.querySelector('#calc1 input#nocritdmg').value * 1;
        dmg2 = document.querySelector('#calc2 input#nocritdmg').value * 1;
    }

    let inputdeal1 = document.querySelector('#compare #input input#deal1').value * 1;
    let inputdeal2 = document.querySelector('#compare #input input#deal2').value * 1;

    let samespecdeal1 = inputdeal1 * 100000 / dmg1;
    let samespecdeal2 = inputdeal2 * 100000 / dmg2;

    let outputdeal1 = samespecdeal1 / (samespecdeal1 + samespecdeal2) * 100;
    let outputdeal2 = samespecdeal2 / (samespecdeal1 + samespecdeal2) * 100;

    document.querySelector('#compare #output input#deal1').value = Math.round(outputdeal1 * 100) / 100;
    document.querySelector('#compare #output input#deal2').value = Math.round(outputdeal2 * 100) / 100;
}

function timecalc(num) {
    let comptype;
    if (document.querySelector('#compcrit').checked) comptype = 'crit';
    else if (document.querySelector('#compnocrit').checked) comptype = 'nocrit';

    let boss;
    let swordl, spearl;
    if (document.querySelector('select#boss').value == 'custom')
        boss = {
            def: document.querySelector('input#bossdef').value * 1,
            res: document.querySelector('input#bossres').value * 1,
            dongsukres: document.querySelector('input#bossdongsukres').value * 1,
            dongsukmindmg: document.querySelector('input#bossdongsukmindmg').value * 1
        };
    else
        boss = bossstat[document.querySelector('select#boss').value];
    if (num == 1) {
        swordl = document.querySelector('#swordl1').checked;
        spearl = document.querySelector('#spearl1').checked;
    } else if (num == 2) {
        swordl = document.querySelector('#swordl2').checked;
        spearl = document.querySelector('#spearl2').checked;
    }

    let dmg, fullspecdmg, inputtime, fullspectime, timedeal;

    if (num == 1) {
        if (comptype == 'crit') {
            dmg = document.querySelector('#calc1 input#critdmg').value * 1;
            fullspecdmg = calcdmg(boss, 99999, 6000, 3550, 90, 999, 999, swordl, spearl)[1];
        } else if (comptype == 'nocrit') {
            dmg = document.querySelector('#calc1 input#nocritdmg').value * 1;
            fullspecdmg = calcdmg(boss, 99999, 6000, 3550, 90, 999, 999, swordl, spearl)[0];
        }
        inputtime = document.querySelector('#timecalc #input input#min1').value * 1 + document.querySelector('#timecalc #input input#sec1').value * 1 / 60;
        timedeal = document.querySelector('#timecalc #input input#timedeal1').value * 1;
    } else if (num == 2) {
        if (comptype == 'crit') {
            dmg = document.querySelector('#calc2 input#critdmg').value * 1;
            fullspecdmg = calcdmg(boss, 99999, 6000, 3550, 90, 999, 999, swordl, spearl)[1];
        } else if (comptype == 'nocrit') {
            dmg = document.querySelector('#calc2 input#nocritdmg').value * 1;
            fullspecdmg = calcdmg(boss, 99999, 6000, 3550, 90, 999, 999, swordl, spearl)[0];
        }
        inputtime = document.querySelector('#timecalc #input input#min2').value * 1 + document.querySelector('#timecalc #input input#sec2').value * 1 / 60;
        timedeal = document.querySelector('#timecalc #input input#timedeal2').value * 1;
    }

    fullspectime = inputtime * dmg / fullspecdmg * 100 / timedeal;

    fullspecmin = Math.floor(fullspectime);
    fullspecsec = Math.round((fullspectime - fullspecmin) * 60);
    fullspecdpm = Math.round((100 / fullspectime * 100)) / 100;

    if (num == 1) {
        document.querySelector('#timecalc #output input#min1').value = fullspecmin;
        document.querySelector('#timecalc #output input#sec1').value = fullspecsec;
        document.querySelector('#timecalc #output input#dpm1').value = fullspecdpm;
    } else if (num == 2) {
        document.querySelector('#timecalc #output input#min2').value = fullspecmin;
        document.querySelector('#timecalc #output input#sec2').value = fullspecsec;
        document.querySelector('#timecalc #output input#dpm2').value = fullspecdpm;
    }
}
