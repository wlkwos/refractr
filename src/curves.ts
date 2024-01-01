/**
 * Create a function that describes a semicircle
 * starting at (-R + d, 0), peaking at (d, R), and
 * ending at (R + d, 0).
 * @param R semicircle radius
 */
let circularRd: Function = function(R: number, d: number) {
    let f = function(x: number) {
        x = x - d;
        return Math.sqrt(R**2 - x**2);
    }

    return f;
}

// derivative of circularRd
let circularPrimeRd: Function = function(R: number, d: number) {
    let fPrime: Function = function(x: number) {
        x = x - d;
        return (- x)/Math.sqrt(R**2 - x**2);
    }

    return fPrime;
}

// inverse of circularRd
let circularInverseRd: Function = function(R: number, d: number) {
    let fInverse: Function = function(x: number) {
        // consider function's domain = (0; R)
        return R - Math.sqrt(R**2 - x**2);
    }

    return fInverse;
}