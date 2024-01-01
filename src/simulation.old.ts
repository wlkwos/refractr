class AnalyticSimulationOld {
    private context: CanvasRenderingContext2D;
    private xO: number;
    private yO: number;

    // definition of left face of lens
    private leftF: Function;
    private leftFPrime: Function;
    private leftFInverse: Function;
    private leftDepth: number;

    // definition of right face of lens
    private rightF: Function;
    private rightFPrime: Function;
    private rightFInverse: Function;
    private rightDepth: number;

    /**
     * 
     * @param context 
     * @param xO 
     * @param yO 
     */
    constructor(context: CanvasRenderingContext2D,
            xO: number,
            yO: number) {
        this.context = context;
        this.xO = xO;
        this.yO = yO;

    }

    public addLeftFace(depth: number, f: Function,
            fPrime: Function, fInverse: Function) {

        if (f(0) !== 0)
            throw new Error('Expected f(0) = 0, but ' + f(0) + ' =/= 0');

        this.leftF = f;
        this.leftFPrime = fPrime;
        this.leftFInverse = fInverse;
        this.leftDepth = depth;
    }

    public addRightFace(depth: number, f: Function,
            fPrime: Function, fInverse: Function) {

        this.rightF = f;
        this.rightFPrime = fPrime;
        this.rightFInverse = fInverse;
        this.rightDepth = depth;

        console.log('this.leftDepth = ' + this.leftDepth);
        console.log('this.rightDepth = ' + this.rightDepth);
        if (f(this.leftDepth + this.rightDepth) !== 0)
            throw new Error('Expected g(leftDepth + rightDepth) = 0, but '
                + f(this.leftDepth + this.rightDepth) + ' =/= 0');
    }

    public drawDiagram() {
        console.log('f(0) = ' + this.leftF(0));
        console.log('f(leftDepth) = ' + this.leftF(this.leftDepth));
        console.log('g(leftDepth) = ' + this.rightF(this.leftDepth));
        console.log('g(leftDepth + rightDepth) = ' + this.rightF(this.leftDepth + this.rightDepth));

        if (this.leftF(this.leftDepth) !== this.rightF(this.leftDepth)) {
            throw new Error('Expected f(leftDepth) === g(leftDepth), but '
                + this.leftF(this.leftDepth) + ' =/= ' + this.rightF(this.leftDepth));
        }
        this.drawLeftLensFace();
        this.drawRightLensFace();
    }

    /**
     * Draw the a curve on the canvas, representing
     * the profile of the lens' left face.
     * 
     * The left face's function will be evaluated on
     * the interval [0, leftDepth] and graph drawn between
     * (xO, yO - leftF(0))
     * & (xO + leftDepth, yO - leftF(leftDepth))
     * on the canvas.
     */
    private drawLeftLensFace(resolution: number=1000) {
        let step = (this.leftDepth + this.rightDepth)/resolution;
        step = step < 1 ? 1 : step;

        console.log('leftDepth = ' + this.leftDepth
             + ', rightDepth = ' + this.rightDepth
             + ', step = ' + step);

        let y, fy;
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.moveTo(this.xO, this.yO - this.leftF(0));
        console.log('Start at: (' + this.xO + ', ' + (this.yO - this.leftF(0)) + ')');
        for (let x = 0; x <= this.leftDepth; x = x + step) {
            fy = this.leftF(x);
            y = this.yO - fy;

            this.context.lineTo(this.xO + x, y);
            // console.log('\tx = ' + x + ', f(x) = ' + fy + ', y = ' + y);
        }
        this.context.lineTo(this.xO + this.leftDepth, this.yO - this.leftF(this.leftDepth));
        // console.log('End at: (' + (this.xO + this.leftDepth) + ', ' + y + ')');
        this.context.stroke();
    }


    /**
     * Draw the a curve on the canvas, representing
     * the profile of the lens' left face.
     * 
     * The right face's function will be evaluated on
     * the interval [leftDepth, leftDepth + rightDepth]
     * and graph drawn between
     * (xO + leftDepth, yO - rightF(leftDepth))
     * & (xO + leftDepth + rightDepth, yO - rightF(leftDepth + rightDepth))
     * on the canvas.
     */
    private drawRightLensFace(resolution: number=1000) {
        let leftY = this.leftF(this.leftDepth);
        let rightY = this.rightF(this.leftDepth);
        if (!approxEquals(leftY, rightY)) {
            throw new Error('Expected f('
                + this.leftDepth + ') = g('
                + this.leftDepth + '), but '
                + leftY + ' =/= ' + rightY);
        }

        let step = (this.leftDepth + this.rightDepth)/resolution;
        step = step < 1 ? 1 : step;

        let y, fy;
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.moveTo(this.xO + this.leftDepth, this.yO - this.rightF(this.leftDepth));
        console.log('Start at: (' + (this.xO + this.leftDepth) + ', '
            + (this.yO - this.rightF(this.leftDepth)) + ')');
        let x: number;
        for (x = this.leftDepth + step; x <= this.leftDepth + this.rightDepth; x = x + step) {
            fy = this.rightF(x);
            y = this.yO - fy;
            this.context.lineTo(this.xO + x, y);
            console.log('\tx = ' + x + ', f(x) = ' + fy + ', y = ' + y);
        }
        this.context.lineTo(this.xO + this.leftDepth + this.rightDepth,
            this.yO - this.rightF(this.leftDepth + this.rightDepth));
        console.log('End at: (' + (this.xO + x) + ', ' + y + ')');
        this.context.stroke();
    }

    /**
     * 
     * @param R 
     * @param lensDepth 
     * @param k: lens glass refraction coeff
    *      (= speed of light vacuum/speed of light in glass)
     */
    public simpleHalfConvexSim(
            R: number,
            checkPoints: Array<Array<number>>,
            lensDepth: number,
            k: number) {
        
        let f: Function = function(x: number) {
            x = x - R;
            return Math.sqrt(R**2 - x**2);
        }
    
        let fPrime: Function = function(x: number) {
            x = x - R;
            return (- x)/Math.sqrt(R**2 - x**2);
        }
    
        let fInverse: Function = function(x: number) {
            // consider function's domain = (0; R)
            return R - Math.sqrt(R**2 - x**2);
        }
    
        let yTop = f(lensDepth);
        drawLensFace(this.context, this.xO, this.xO + lensDepth, this.yO, f);
        drawLensVertical(this.context, this.xO + lensDepth, this.yO - yTop, this.yO);
    
        let y1 = yTop/5;
        this.startFrom(-150, y1);
    
        let funx = new AnalyticFunctionTriplet(f, fPrime, fInverse, checkPoints);
    
        let x1 = funx.fInverse(y1);
        this.drawTo(x1, y1);
        this.context.stroke();
    }

    private startFrom(x, y) {
        this.context.beginPath();
        this.context.moveTo(this.xO + x, this.yO - y);
    }

    private drawTo(x, y) {
        this.context.lineTo(this.xO + x, this.yO - y);
    }
}