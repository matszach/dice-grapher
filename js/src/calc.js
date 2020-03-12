
// ============================= CONST ============================
const ID = {
    RULE_INPUT: '#rule-input',
    NOF_ROLES_INPUT: '#nof-rolls-input',
    MIN_OUT_P: '#min-outcome-p',
    MAX_OUT_P: '#max-outcome-p',
    AVG_OUT_P: '#avg-outcome-p',
    ROLLS_P: '#rolls-p'
} 

const REGEX = {
    SUM: /sum[\d]{1,}d[\d]{1,}/g,
    MIN: /min[\d]{1,}d[\d]{1,}/g,
    MAX: /max[\d]{1,}d[\d]{1,}/g
}

const MAX_ROLLS_DISPLAYED = 25;

// ============================= MAIN CALC FUNCTION ============================
function calculate() {
    let raw = $(ID.RULE_INPUT).val();
    let rule = parseRollRule(raw);
    let minOutcome = parseMinOutcome(raw);
    let maxOutcome = parseMaxOutcome(raw);
    let avgOutcome = parseAvgOutcome(raw);
    let nofRolls = $(ID.NOF_ROLES_INPUT).val() || 1;
    let rolls = getRolls(rule, nofRolls);
    displayOutcomes(minOutcome, maxOutcome, avgOutcome, rolls);
}

// ============================= RULE PARSING ============================
function parseRollRule(rawRule) {
    regexMatchOrEmptyArray(rawRule, REGEX.SUM).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `sumRoll(${val.n}, ${val.d})`);
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MIN).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `minRoll(${val.n}, ${val.d})`);
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MAX).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `maxRoll(${val.n}, ${val.d})`);
    });
    return eval(`(() => ${rawRule});`);
}

function parseMinOutcome(rawRule) {
    regexMatchOrEmptyArray(rawRule, REGEX.SUM).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `${val.n}`);
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MIN).forEach(e => {
        rawRule = rawRule.replace(e, `1`);
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MAX).forEach(e => {
        rawRule = rawRule.replace(e, `1`);
    });
    return eval(rawRule);
}

function parseMaxOutcome(rawRule) {
    regexMatchOrEmptyArray(rawRule, REGEX.SUM).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `(${val.n} * ${val.d})`);
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MIN).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `${val.d}`);
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MAX).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `${val.d}`);
    });
    return eval(rawRule);
}

function parseAvgOutcome(rawRule) {
    regexMatchOrEmptyArray(rawRule, REGEX.SUM).forEach(e => {
        let val = toValues(e);
        rawRule = rawRule.replace(e, `(${val.n} * ${val.d/2 + 0.5})`);
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MIN).forEach(e => {
        let val = toValues(e);

        let totalRolls = 0;
        let sum = 0;
        for(let i = 1; i <= val.d; i++) {
            let nof = 1
            for(let j = val.n - 1; j > 0; j--) {
                nof += val.n * Math.pow(val.d - i, j)
            }
            totalRolls += nof;
            sum += i * nof;
        }
        let avg = sum/totalRolls;

        rawRule = rawRule.replace(e, `${avg}`); // todo
    });
    regexMatchOrEmptyArray(rawRule, REGEX.MAX).forEach(e => {
        let val = toValues(e);

        let totalRolls = 0;
        let sum = 0;
        for(let i = val.d; i > 0; i--) {
            let nof = 1
            for(let j = val.n - 1; j > 0; j--) {
                nof += val.n * Math.pow(i - 1, j)
            }
            totalRolls += nof;
            sum += i * nof;
        }
        let avg = sum/totalRolls;

        rawRule = rawRule.replace(e, `${avg}`); // todo
    });
    return eval(rawRule);
}

function toValues(regexFound) {
    let split = regexFound.slice(3).split('d');
    return {
        n: parseInt(split[0]),
        d: parseInt(split[1])
    };
}

// ============================= HELPER FUNCTIONS ============================
function regexMatchOrEmptyArray(string, regex) {
    let matches = string.match(regex);
    return matches ? matches : [];
}

function getRolls(rollRule, nofRolls) {
    let result = [];
    for(let i = 0; i < nofRolls; i++) {
        result.push(rollRule());
    } 
    return result;
}

// ============================= DISPLAY ============================
function displayOutcomes(min, max, avg, rolls) {
    $(ID.MIN_OUT_P).html(min);
    $(ID.MAX_OUT_P).html(max);
    $(ID.AVG_OUT_P).html(avg);
    $(ID.ROLLS_P).html(
        rolls.length <= MAX_ROLLS_DISPLAYED ? rolls.join(', ') : rolls.slice(0, MAX_ROLLS_DISPLAYED).join(', ') + ' ...'
    );
    let chartData = createChartData(min, max, avg, rolls);
    ChartPainter.draw(chartData);
}


function createChartData(min, max, avg, rolls) {
    let rollTable = Gmt.constructArray(max + 1, () => 0);
    rolls.forEach(e => rollTable[Math.round(e)]++);
    return {
        min: min,
        max: max, 
        avg: avg,
        nofRolls: rolls.length,
        rollTable: rollTable
    };
}