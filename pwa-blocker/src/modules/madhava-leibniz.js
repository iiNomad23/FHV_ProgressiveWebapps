/**
 * This module provides a simple and not so efficient algorithm to approximate π,
 * the so called Madhava–Leibniz series:
 * 
 *       π = 4 * (1 - 1/3 + 1/5 - 1/7 + 1/9 - ... )
 * 
 * We intentionally take this series, since it has a poor convergence which means,
 * it consumes lots of CPU cycles in order to generate a few digits of π.
 * 
 * For a detailed discussion on approximations of π see:
 * https://en.wikipedia.org/wiki/Approximations_of_π
 * 
 */

var step = 2.0;
var arctanMax = 1.0;
var arctanMin = 2.0 / 3.0;

/**
 * Compute an approximation of π.
 * Successive calls will continue the approximation reached with the previous call(s),
 * therefore producing more accurate values for π.
 * 
 * @param {*} seconds number of seconds allowed for the next computation step.
 * @returns an object { piMin: *, piMax: *, pi: * } with piMin and piMax lower and upper bounds
 *          and pi with all accurate decimal places computed so far.
 */
export function giveMePi(seconds) {
    let stopTime = Date.now() + 1000 * seconds; //in miliseconds

    do {
        //we suppose, that 1 Mio. iterations take far less that 1 sec. 
        for (let count = 1000000; count > 0; count--) {
            step += 4.0;
            arctanMax = arctanMin + 1.0 / (step - 1.0);
            arctanMin = arctanMax - 1.0 / (step + 1.0);
        }
        //and we check the elapsed CPU time at a low frequency in order to spend
        //most CPU cycles for the computation
    } while (Date.now() < stopTime);

    //how many decimal places are accurate?
    let devisor = 1.0;
    let min = 4.0 * arctanMin;
    let max = 4.0 * arctanMax;
    let precision = 16;     //JS floating point numbers are double-precision 64-bit, i.e. 17 decimal digits
    let pi = 3.0;
    while (Math.trunc(min) == Math.trunc(max) && precision-- > 0) {
        pi = Math.trunc(min) / devisor;
        devisor = devisor * 10.0;
        min = min * 10.0;
        max = max * 10.0;
    }

    return { piMin: 4.0 * arctanMin, piMax: 4.0 * arctanMax, pi: pi };

}