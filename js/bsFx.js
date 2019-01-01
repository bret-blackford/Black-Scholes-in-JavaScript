// written by: Michael Bret Blackford (mBret)
// Harvard CSCI e-12

/* The Black and Scholes (1973) Stock option formula */
//  S = Stock price
//  X = Strike price
//  T = Years to maturity
//  r = Risk-free rate
//  v = Volatility

function BlackScholes(PutCallFlag, S, X, T, r, v) {
    console.log("  in BlackScholes(" + PutCallFlag + "," + S + "," + X + "," + T + "," + r + "," + v + ")");

    var d1 = (Math.log(S / X) + (Number(r) + Number(v) * Number(v) / 2.0) * T) / (Number(v) * Math.sqrt(T));

    var d2 = d1 - v * Math.sqrt(T);

    var sd1 = standardNormalDistribution(d1);
    var cd1 = cumulativeDistribution(d1, sd1);

    console.log("  d1=[" + d1 + "] d2=[" + d2 + "] sd1=[" + sd1 + "]");

    if (PutCallFlag == "CALL") {
        var delta = cd1;
        console.log(" delta=[" + delta + "]");
        var bsCall = S * CND(d1) - X * Math.exp(-r * T) * CND(d2);
        rsp = new Resp(bsCall, delta);
        console.log("BlackScholes(CALL) :" + rsp.toString());
        return rsp;
    } else {
        var delta = cd1 - 1;
        console.log("  in BlackScholes() calculating as a PUT");
        console.log(" delta=[" + delta + "]");
        var bsPut = X * Math.exp(-r * T) * CND(-d2) - S * CND(-d1);
        rsp = new Resp(bsPut, delta);
        console.log("BlackScholes(PUT) :" + rsp.toString());
        return rsp;
    }
}


/* The cummulative Normal distribution function: */
function CND(x) {
    console.log("in CND(" + x + ")");
    var a1, a2, a3, a4, a5, k;
    a1 = 0.31938153, a2 = -0.356563782, a3 = 1.781477937, a4 = -1.821255978, a5 = 1.330274429;
    if (x < 0.0)
        return 1 - CND(-x);
    else
        k = 1.0 / (1.0 + 0.2316419 * x);
    return 1.0 - Math.exp(-x * x / 2.0) / Math.sqrt(2 * Math.PI) * k *
        (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429))));
}

/* Cumulative Distribution fx() */
function cumulativeDistribution(x, sdx) {
    console.log(" in cumulativeDistribution(" + x + "," + sdx + ")");
    var P = 0.2316419;
    var B1 = 0.319381530;
    var B2 = -0.356563782;
    var B3 = 1.781477937;
    var B4 = -1.821255978;
    var B5 = 1.330274429;

    var t = 1 / (1 + P * Math.abs(x));
    var t1 = B1 * Math.pow(t, 1);
    var t2 = B2 * Math.pow(t, 2);
    var t3 = B3 * Math.pow(t, 3);
    var t4 = B4 * Math.pow(t, 4);
    var t5 = B5 * Math.pow(t, 5);
    var b = t1 + t2 + t3 + t4 + t5;
    var cd = 1 - sdx * b;

    if (x < 0) {
        return 1 - cd;
    }
    return cd;
}


function standardNormalDistribution(x) {
    console.log(" in BlackScholesFormula:standardNormalDistribution(" + x + ")");
    var top = Math.exp(-0.5 * Math.pow(x, 2));
    var bottom = Math.sqrt(2 * Math.PI);
    var resp = top / bottom;

    return resp;
}

class Resp {
    constructor(valuation, delta) {
        this.valuation = valuation;
        this.delta = delta;
    }
    toString() {
        var s = "val=[" + this.valuation + "] delta=[" + this.delta + "]";
        return s;
    }
}