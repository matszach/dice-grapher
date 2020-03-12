function roll(dieSize) {
    return Gmt.randInt(1, dieSize);
}

function sumRoll(n, dieSize) {
    let sum = 0;
    for(let i = 0; i < n; i++) {
        sum += roll(dieSize);
    }
    return sum;
}

function minRoll(n, dieSize) {
    let min = dieSize;
    for(let i = 0; i < n; i++) {
        let r = roll(dieSize);
        if(r < min) {
            min = r;
        }
    }
    return min;
}

function maxRoll(n, dieSize) {
    let max = 0;
    for(let i = 0; i < n; i++) {
        let r = roll(dieSize);
        if(r > max) {
            max = r;
        }
    }
    return max;
}
