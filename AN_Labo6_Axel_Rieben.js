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
    if (input > 90 || input < 0) {
        $('error').value = "The value must be a number beetween 0 and 90";
    } else {
        $('error').value = "";

        //Convert degrees into radians
        input = (input * Math.PI) / 180;
        console.log(input);
        //$('result').value = cordicSin(input);
        let resultArray = cordic(input);
        $('result').value = "Cosinus : " + resultArray[0] + " Sinus : " + resultArray[1];
    }
}

/*******************************************************/
/* CORDIC Algorith                                     */
/*******************************************************/

//constants
var arctanTable = new Array();
var iterations = 40;
var K = 0.60725293510314;

//create the lookup table with arctan value of 10^-i with i from 0 to the numerber of iterations
function init() {
    for (let i = 0; i < iterations; i++) {
        arctanTable.push(Math.atan(Math.pow(2, -i)));
        //arctanTable.push(Math.atan(Math.pow(10, -i)));
    }
    console.log(arctanTable);
}

//function
function cordicSin(theta) {
    //Initialisation of the system
    let x = K;
    let y = 0;
    let z = theta;
    let v = 1.0;

    //Loop the algorithm for the number of iterations
    for (let i = 0; i < iterations; i++) {

        //if the angle is
        let d;
        if (z >= 0) {
            d = 1;
        } else {
            d = -1;
        }

        //Calculate the next values
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

//V2
function cordic(alpha) {
    //Initialisation of the system
    let x = 1;
    let y = 0;
    let r = 1;

    //Loop the algorithm for the number of iterations
    for (let i = 0; i < iterations; i++) {
        while (alpha > arctanTable[i]) {
            let dx = x - y * Math.pow(2, -i);
            let dy = y + x * Math.pow(2, -i);
            let rx = r * Math.sqrt(1 + Math.pow(Math.pow(2, -i), 2));
            alpha = alpha - arctanTable[i];

            x = dx;
            y = dy;
            r = rx;
            console.log("Cordic iteration : " + i + ", x = " + x + ", y = " + y + ", r = " + r + ", alpha = " + alpha);
        }
        console.log("Next iteration : " + i + " alpha = " + alpha);

        let cos = x / r;
        let sin = y / r;
        let tan = sin / cos;

        console.log("Result cos = " + cos + " sin = " + sin + " tan = " + tan);
    }

    let cos = x / r;
    let sin = y / r;
    let tan = sin / cos;

    console.log("Result cos = " + cos + " sin = " + sin + " tan = " + tan);
    return [cos, sin];
}
