/****************************************************************************/
/* Authors : Axel Rieben                                                    */
/* Date : 10 juin 2017                                                      */
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

//Convert degrees into radians
function toRadians(value) {
    return (value * Math.PI) / 180;
}

/*******************************************************/
/* User/html interactions                              */
/*******************************************************/

//Function called when the run button is pressed
function run() {
    let input = $('alpha').value;
    let iteration = $('iteration').value;

    //Check if the value is beetween 0 and 90 degrees (the CORDIC algorithm don't work with other values)
    if (input > 90 || input < 0 || isNaN(input)) {
        $('errorAlpha').value = "The value must be a number beetween 0 and 90";
    } else {
        $('errorAlpha').value = "";

        if (iteration > 100 || iteration < 1 || isNaN(iteration)) {
            $('errorIteration').value = "The value must be a number beetween 1 and 100";
        } else {
            $('errorIteration').value = "";

            input = toRadians(input);
            iterations = $('iteration').value;
            init();

            //Use CORDIC and calculate time
            let time = Date.now();
            let resultArray = cordic(input);
            time = Date.now() - time;

            //Show results in HTML
            $('cordicCos').value = resultArray[0];
            $('cordicSin').value = resultArray[1];
            $('cordicTan').value = resultArray[0] / resultArray[1];

            $('jsCos').value = Math.cos(input);
            $('jsSin').value = Math.sin(input);
            $('jsTan').value = Math.sin(input) / Math.cos(input);

            $('diffCos').value = Math.abs(Math.cos(input) - resultArray[0]);
            $('diffSin').value = Math.abs(Math.sin(input) - resultArray[1]);
            $('diffTan').value = Math.abs((Math.sin(input) / Math.cos(input)) - (resultArray[1] / resultArray[0]));

            $('cordicTime').value = "Computation time for " + iterations + " iteration(s) : " + time + " ms";
        }

    }
}

/*******************************************************/
/* CORDIC Algorithm                                    */
/*******************************************************/

//Constants
var omegaTable = new Array();
var arctanTable = new Array();
var iterations;

//Create a table containing every values of 2^-i
//And create a second table with arctan value of 2^-i
//With i from 0 to the number of iterations
function init() {
    for (let i = 0; i < iterations; i++) {
        omegaTable.push(Math.pow(2, -i));
        arctanTable.push(Math.atan(omegaTable[i]));
    }
    console.log(arctanTable);
}

//Approximate cosine and sine of a given angle using the CORDIC method
//Return [cos(alpha), sin(alpha)]
function cordic(alpha) {
    //Initialisation of the system
    let x = 1;
    let y = 0;
    let r = 1;

    //Loop the algorithm for the number of iterations
    for (let i = 0; i < iterations; i++) {

        while (alpha > arctanTable[i]) {
            //Calculate the next values
            let dx = x - y * omegaTable[i];
            let dy = y + x * omegaTable[i];
            let rx = r * Math.sqrt(1 + Math.pow(omegaTable[i], 2));

            //Affect the new values
            alpha = alpha - arctanTable[i];
            x = dx;
            y = dy;
            r = rx;

            console.log("Cordic iteration : " + i + ", x = " + x + ", y = " + y + ", r = " + r + ", alpha = " + alpha);
        }
    }

    let cos = x / r; //Adjacent / hypotenus
    let sin = y / r; //Opposed / hypotenus
    return [cos, sin];
}
