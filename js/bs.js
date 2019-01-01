// written by: M. Bret Blackford (mBret)
// Harvard CSCI e-12
// December 10, 2018


//run Black-Scholes VALUATION once
function process1() {
    console.log("in process1() ========== ");
    formData1 = getFormData();
    console.log("formData1 = " + formData1.toString());

    rsp1 = BlackScholes(formData1.pc, formData1.S, formData1.X, formData1.T, formData1.r, formData1.v);
    console.log(" and we received " + rsp1.toString());

    populateDeleteTable(formData1.S, formData1.X, formData1.t1, formData1.t2, formData1.T, formData1.r, formData1.v, formData1.pc, rsp1.valuation, rsp1.delta, formData1.note);

    sendResponse(rsp1.valuation.valueOf(), rsp1.delta.valueOf());

    console.log(" ===== DONE ===== process1() =====");
}

//run Black-Scholes VALUATION multiple times
function process2() {
    console.log("in process2() ========== ");
    formData2 = getFormData();
    console.log("formData1 = " + formData2.toString());

    extraStuff(formData2);

    console.log(" ===== DONE ===== process2() =====");
}

function getFormData() {
    console.log("now in getFormData()");

    //alert("now in getFormData()");
    var S = document.getElementById("stkPrice").value.trim();
    var X = document.getElementById("strikePrice").value.trim();
    var r = document.getElementById("interst").value.trim();
    var v = document.getElementById("vol").value.trim();

    var pc = document.getElementById("pcFlag").value;

    var note = document.getElementById("notes").value;
    console.log(" notes:[" + note + "]");

    var exp_dt = document.getElementById("exp_date").value.trim();
    var val_dt = document.getElementById("val_date").value.trim();
    dt1 = new Date(exp_dt);
    dt2 = new Date(val_dt);

    var inString = "S:[" + S + "] X:[" + X + "] r:[" + r + "] v:[" + v + "] pc:[" + pc + "] ";
    inString += "exp_dt:[" + exp_dt + "] val_dt:[" + val_dt + "]";
    console.log("getFormData: " + inString);

    var s1 = document.getElementById("display");
    console.log("content of DiSPLAY:[" + s1 + "]");

    var timeDiff = diff_minutes(dt1, dt2);
    console.log("time difference=[" + timeDiff + "]");
    var timeToExp = (timeDiff / 60 / 24) / 365;
    console.log("time difference=[" + timeToExp + "]");
    Tn = timeToExp;

    formData = new FormData(S, X, r, v, pc, exp_dt, val_dt, timeToExp, note);
    console.log("formData.note=[" + formData.note + "]");
    return formData;
}

function extraStuff(form_data) {
    console.log("in extraStuff()");
    console.log(" form_data = " + form_data.toString());

    rsp1 = BlackScholes(form_data.pc, form_data.S, form_data.X, form_data.T, form_data.r, form_data.v);
    console.log(" and we received " + rsp1.toString());

    //loop 10 times and change S on each run
    var myMap1 = new Map();
    //myMap.set(.85,0.0)
    var inc;
    var multiplyer = [];

    // stock price changes
    for (inc = 75; inc < 130; inc += 5) {
        var addr = (inc / 100);
        multiplyer.push(addr);
        console.log("incrementing Map1(" + addr + ")");
        resp1 = BlackScholes(form_data.pc, form_data.S * addr, form_data.X, form_data.T, form_data.r, form_data.v);
        var valuation = Math.trunc(resp1.valuation * 1000000) / 1000000;
        myMap1.set(inc, valuation);
        var sTmp = Math.trunc(form_data.S * addr * 10000);

        populateTable(sTmp / 10000, form_data.X, form_data.t1, form_data.t2, form_data.T, form_data.r, form_data.v, form_data.pc, valuation, resp1.delta, inc / 100);
    }

    var valByPrice = [];
    myMap1.forEach(function (value, key) {
        console.log("   key=[" + (1 - (key / 100)) + "] myMap1");
        console.log(" value=[" + value + "]");
        valByPrice.push(value);
    });


    // volatility changes
    var myMap2 = new Map();
    for (inc = 75; inc < 130; inc += 5) {
        var addr = (inc / 100);
        console.log("incrementing Map2(" + addr + ")");
        resp1 = BlackScholes(form_data.pc, form_data.S, form_data.X, form_data.T, form_data.r, form_data.v * addr);
        var valuation = Math.trunc(resp1.valuation * 1000000) / 1000000;
        myMap2.set(inc, valuation);
        var vTmp = Math.trunc(form_data.v * addr * 10000);

        populateTable(form_data.S, form_data.X, form_data.t1, form_data.t2, form_data.T, form_data.r, vTmp / 10000, form_data.pc, valuation, resp1.delta, inc / 100);
    }

    var valByVol = [];
    myMap2.forEach(function (value, key) {
        console.log("   key=[" + (1 - (key / 100)) + "] myMap2");
        console.log(" value=[" + value + "]");
        valByVol.push(value);
    });



    //document.getElementById("display").innerHTML = outString; //document.getElementById("val_div_id").innerHTML = bsValuation.toFixed(4);
    document.getElementById("val_div_id").innerHTML = rsp1.valuation.valueOf().toFixed(6);
    document.getElementById("delta_div_id").innerHTML = rsp1.delta.valueOf().toFixed(6);

    /* ========= ========= ========= ========= */
    /* NEW STUFF */
    console.log("preparing to send data to chart");
    console.log("valByPrice:" + valByPrice);
    console.log("valByVol:" + valByVol);
    //populateTable(S, X, exp_dt, val_dt, timeToExp, r, v, pc, rsp1.valuation, rsp1.delta, note);

    var itrLabel = [-0.15, -0.10, -.05, 0.0, 0.05, 0.10, 0.15];

    var ctx1 = document.getElementById("myChart1");
    console.log(" creating myChart1");
    var myChart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            //labels: itrLabel,
            labels: multiplyer,
            datasets: [{
                label: 'price change',
                data: valByPrice
                   }]
        },

        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Fair Value in $ US'
                    }
        }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'change from original price of the underlying'
                    }
        }]
            }
        }

    });

    var ctx2 = document.getElementById("myChart2");
    console.log(" creating myChart2");
    var myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: multiplyer,
            datasets: [{
                label: ' volatlity change',
                data: valByVol
                   }]
        },

        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Fair Value in $ US'
                    }
        }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'change from original volatility of the underlying'
                    }
        }]
            }
        }

    });

    var ctx3 = document.getElementById("myChart3");
    console.log(" creating myChart3");
    var myChart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: multiplyer,
            datasets: [{
                    label: ' volatlity change',
                    data: valByVol,
                    borderColor: "#3e95cd",
                    fill: false
                   }, {
                    label: ' price change',
                    borderColor: "#8e5ea2",
                    data: valByPrice
                   }
                             ]
        },

        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Fair Value in $ US'
                    }
        }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'change from original volatility & price of the underlying'
                    }
        }]
            }
        }

    });
    /* ========= ========= ========= ========= */


    console.log(" ===== DONE ===== ");
}






function populateTable(s, x, t1, t2, t, r, v, pc, val, d, note) {
    console.log("in populateTable()");
    console.log(" s-" + s + " x-" + x + " t1-" + t1 + " t2-" + " t-" + t);
    console.log(" r-" + r + " v-" + v + " pc-" + pc + " val-" + val + " d-" + d + " note-" + note);
    var num = t;
    var t5 = num.toFixed(5);
    num = val;
    var fv = num.toFixed(5);
    num = d;
    var delt = num.toFixed(5);

    /*var name = $("#name").val();
    var email = $("#email").val();*/
    var markup = "<tr><td>" + s + "</td><td>" + x + "</td><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t5 + "</td><td>" + r + "</td><td>" + v + "</td><td>" + pc + "</td><td>" + fv + "</td><td>" + delt + "</td><td>" + note + "</td>< /tr >";
    $("table tbody").append(markup);
};

function populateDeleteTable(s, x, t1, t2, t, r, v, pc, val, d, knote) {
    console.log("in populateDeleteTable()");
    var precision = 100000;
    var numb = t;
    console.log("t:" + t + " t1:" + t1 + " t2:" + t2 + " numb:" + numb + " note:" + knote);
    var t5 = (Math.trunc(numb * precision)) / precision;
    console.log(" t5:" + t5);
    numb = val;
    var fv = Math.trunc(numb * precision) / precision;
    console.log(" fv:" + fv);
    numb = d;
    var delt = Math.trunc(numb * precision) / precision;
    console.log(" delt:" + delt);

    var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + s + "</td><td>" + x + "</td><td>" + t1 + "</td><td>" + t2 + "</td><td>" + t5 + "</td><td>" + r + "</td><td>" + v + "</td><td>" + pc + "</td><td>" + fv + "</td><td>" + delt + "</td><td>" + knote + "</td>< /tr >";

    $("table tbody").append(markup);
}

// calculates the number of minutes between 2 dates
function diff_minutes(dt2, dt1) {
    console.log("in diff_minutes(" + dt2 + "," + dt1 + ")");
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    var timeDiff = Math.abs(Math.round(diff));

    console.log(" leaving diff_minutes() with [" + timeDiff + "]");
    return timeDiff;
}

function sendResponse(fairValue, delta) {
    console.log("in sendResponse(" + fairValue + ", " + delta + ")");
    var fv = Math.trunc(fairValue * 100000) / 100000;
    var change = Math.trunc(delta * 100000) / 100000;
    document.getElementById("val_div_id").innerHTML = fv;
    document.getElementById("delta_div_id").innerHTML = change;
}


function deleteRow() {
    console.log("in deleteRow()");
    $("table tbody").find('input[name="record"]').each(function () {
        if ($(this).is(":checked")) {
            $(this).parents("tr").remove();
        }
    });
}

function printToExcel() {
    console.log("in printToExcel()");
    $("#valuationTable").table2excel({
        filename: "valuation.xls"
    });
}

class FormData {
    constructor(S, X, r, v, pc, t1, t2, T, note) {
        this.S = S;
        this.X = X;
        this.r = r;
        this.v = v;
        this.pc = pc;
        this.t1 = t1;
        this.t2 = t2;
        this.T = T;
        this.note = note;
    }
    toString() {
        var str = " S[" + this.S + "] X[" + this.X + "] r[" + this.r + "] v[" + this.v + "] pc[" + this.pc + "] t1[" + this.t1 + "] t2[" + this.t2 + "] T[" + this.T + "][" + this.note + "]";
        return str;
    }
}

$(document).ready(function () {
    console.log("Ready to run JavaSCript ...");
    var mybodyid = $('body').attr('id');
    var mynavid = '#nav-' + mybodyid;
    console.log("mybodyid-[" + mybodyid + "] mynavid-[" + mynavid + "]");

    $(mynavid).attr('id', 'iamhere');
});