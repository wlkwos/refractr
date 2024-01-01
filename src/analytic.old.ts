class AnalyticFunctionTriplet {
    public f: Function;
    public fPrime: Function;
    public fInverse: Function;

    constructor(f: Function, fPrime: Function, fInverse: Function,
            checkPoints: Array<Array<number>>) {
        
        this.f = f;

        let n = checkPoints.length;
        if (n === 0)
            throw Error('No checkpoints provided!');

        for (let i = 0; i < n; i++) {
            let p = checkPoints[i];

            if (p.length !== 2)
                throw Error('Checkpoint [' + p + '] is not a point');

            let x = p[0];
            let y = p[1];

            let tolerance = 0.0001;
            let fx = f(x);
            if (!approxEquals(fx, y, tolerance))
                throw Error('f(' + x + ') = ' + fx + ' != ' + y);

            let tangent = (f(x + tolerance**2) - f(x))/tolerance**2;
            let fprimex = fPrime(x);
            console.log(fprimex, tangent);
            if (!approxEquals(fprimex, tangent, tolerance))
                throw Error('fPrime(' + x + ') = ' + fprimex + 
                ' doesn\'t match tangent  = ' + tangent);

            let finversey = fInverse(y);
            if (!approxEquals(finversey, x))
                throw Error('fInverse(y) = ' + finversey + ' doesn\'t match x = ' + x);
            
        }

        this.fInverse = fInverse;
        this.fPrime = fPrime;
    }
}