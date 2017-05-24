/****************************************************************************/
/* Authors : Axel Rieben                                                    */
/* Date : 18 mai 2017                                                       */
/* Numerical algorithm : CORDIC                                             */
/****************************************************************************/

/*******************************************************/
/* Tools                                               */
/*******************************************************/

function $(id) {
    return document.getElementById(id);
}

function $name(name) {
    return document.getElementsByName(name);
}

/*******************************************************/
/* User/html interactions                              */
/*******************************************************/

//function called when the run button is pressed
function run() {
    let input = $('theta').value;
    //Convert degrees into radians
    input = (input*Math.PI) / 180;
    console.log(input);
    $('result').value = cordicSin(input);
}

/*******************************************************/
/* CORDIC Algorith                                     */
/*******************************************************/

//Constants
var arctanTable = new Array();
var iterations = 40;
var K = 0.60725293510314;

//Create the lookup table with arctan value of (1 / 2^i) with i from 0 to the numerber of iterations
function init() {
    for (let i = 0; i < iterations; i++) {
        arctanTable.push(Math.atan(1 / Math.pow(2, i)));
    }
    console.log(arctanTable);
}

function cordicSin(theta) {
    let x = K;
    let y = 0;
    let z = theta;
    let v = 1.0;

    for (let i = 0; i < iterations; i++) {
        let d;
        if (z >= 0) {
            d = 1;
        } else {
            d = -1;
        }

        let tx = x - d * y * v;
        let ty = y + d * x * v;
        let tz = z - d * arctanTable[i];

        x = tx;
        y = ty;
        z = tz;
        v *= 0.5;

        console.log("Cordic iteration : " + i + ", x = " + x + ", y = " + y);
    }

    return x;
}
