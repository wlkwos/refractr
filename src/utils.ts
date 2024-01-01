/** Check a & b are equal, within tolerance t.
 */
function approxEquals(a: number, b: number, t: number = 10**(-11)): boolean {
    return (a < b + t) && (a > b - t);
}

function assertStrictlyPositive(n: number, label: string) {
    if (n <= 0)
        throw new Error(`Required that ${label} (=${n}) > 0`);
}

/**
 * @param f a function that should be derivable
 * @returns a function that numerically approximates the derivative of f
 */
function generateDerivative(f: Function): Function {
    const infinitesimal = 10**(-10)
    return (x: number) => {
        return (f(x + infinitesimal) - f(x - infinitesimal))
            /(2*infinitesimal)
    }
}

/**
 * @param f a function monotonous over the domain
 * @param xStart lower bound of f's domain
 * @param xEnd upper bound of f's domain
 * @returns a function that numerically approximates the inverse of f
 * over domain [xStart, xEnd]
 */
function generateInverse(f: Function, xStart: number, xEnd: number) {
    if (xEnd <= xStart) throw new Error(`Invalid domain bounds: (${xStart}, ${xEnd})`)
    if (f(xStart) === f(xEnd)) throw new Error(`Expected a monotonous function, but end values are equal`)

    return (y: number) => {
        let l1
        let l2

        if (f(xStart) < f(xEnd)) {
            l1 = xStart
            l2 = xEnd
        } else {
            l1 = xEnd
            l2 = xStart
        }

        let m: number
        let fm: number

        do {
            m  = (l1 + l2)/2
            fm = f(m)

            if (approxEquals(fm, y))
                return m;

            if (y < fm)
                l2 = m
            else
                l1 = m
        } while (true)
    }
}