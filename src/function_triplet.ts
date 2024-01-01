/**
 * Define a triplet containing a bijective function, its derivative,
 * its inverse, and its domain & codomain. Domain and codomain must
 * be finite.
 */
class FunctionTriplet {
    private c1: number
    private c2: number
    public f: Function
    public fPrime: Function
    public fInverse: Function
    private d1: number
    private d2: number

    /**
     * Codomain deduced from domain.
     * @param f must be strictly monotonous over (d1, d2)
     * @param fPrime f's derivative; if not given, a numeric approximation
     *  is generated
     * @param fInverse f's inverse; if not given, a numeric approximation
     *  is generated
     * @param d1 lower limit of f's domain; d1 > d2
     * @param d2 upper limit of f's domain
     */
    constructor(f: Function, fPrime: Function, fInverse: Function,
            d1: number, d2: number) {
        if (!f) throw new Error('f is missing')
        if (d1 >= d2) throw new Error(`Required that d1 [${d1}] < d2 [${d2}]`)

        let c1 = f(d1)
        let c2 = f(d2)
        if (c1 === c2) throw new Error('f is not strictly monotonous')

        this.d1 = d1;
        this.d2 = d2;

        if (c1 < c2) {
            this.c1 = c1
            this.c2 = c2
        } else {
            this.c1 = c2
            this.c2 = c1
        }

        this.f = (x: number) => {
            this.assertIsInDomain(x)
            return f(x)
        }

        let _fPrime = fPrime ? fPrime : generateDerivative(f)
        this.fPrime = (x: number) => {
            this.assertIsInDomain(x)
            return _fPrime(x)
        }

        let _fInverse = fInverse ? fInverse : generateInverse(f, d1, d2)
        this.fInverse = (y: number) => {
            this.assertIsInCodomain(y)
            return _fInverse(y)
        }
    }

    public shiftRight(delta: number): FunctionTriplet {
        let newF = (x: number) => this.f(x - delta);
        let newD1 = this.d1 + delta;
        let newD2 = this.d2 + delta;

        return new FunctionTriplet(
            newF,
            generateDerivative(newF),
            generateInverse(newF, newD1, newD2),
            newD1, newD2
        )
    }

    private assertIsInDomain(x: number) {
        if ((x < this.d1) || (x > this.d2))
            throw new Error(`${x} not within [${this.d1}, ${this.d2}]`);
    }

    private assertIsInCodomain(y: number) {
        if ((y < this.c1) || (y > this.c2))
            throw new Error(`${y} not within [${this.c1}, ${this.c2}]`);
    }
}