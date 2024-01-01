/**
 * Start with the constructor:
 * establish the drawing space: the canvas context and the point of origin;
 * 
 * then define the lens: tau, the maximum horizontal thickness,
 * and the functions describing the curvatures of the faces;
 * both should be 0 at x = 0
 */
class AnalyticSimulation {
    private context: CanvasRenderingContext2D;
    // coordinates of actual origin of the drawing on the canvas
    private canvasXO: number;
    private canvasYO: number;

    // maximum horizontal thickness of the lens
    private tau: number;

    // definition of left face of lens
    private leftFace: FunctionTriplet

    // definition of right face of lens
    private rightFace: FunctionTriplet

    // virtual coordinates of intersection of lenses;
    // must be combined with the origin during drawing
    private xIntersect: number;
    private yIntersect: number;

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
        assertStrictlyPositive(xO, 'xO');
        this.canvasXO = xO;
        assertStrictlyPositive(yO, 'yO');
        this.canvasYO = yO;

    }

    public specifyLens(tau: number, leftFace: FunctionTriplet, rightFace: FunctionTriplet) {
        assertStrictlyPositive(tau, 'tau');
        this.tau = tau;

        if (!(leftFace.f(0) == 0)) {
            throw new Error(`Required that leftFace(0) [=${leftFace.f(0)}] = 0`);
        }
        this.leftFace = leftFace;

        if (!(rightFace.f(0) == 0)) {
            throw new Error(`Required that rightFace(0) [=${rightFace.f(0)}] = 0`);
        }
        this.rightFace = rightFace.shiftRight(tau);
    }

    public drawLens() {
        // TODO

        // check both faces set

        // calculate intersection of left and right faces

        // erase canvas

        // draw left face, x in [xO, xIntersect]
        this.xIntersect = 100;

        this.drawFace(this.leftFace.f, 0, this.xIntersect);
    }

    private drawFace(faceFunc: Function, xStart: number, xEnd: number, resolution: number=1000) {
        let step = (xStart + xEnd)/resolution;
        step = step < 1 ? 1 : step;

        let canvasY, fy;
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.moveTo(this.canvasXO + xStart, this.canvasYO - faceFunc(xStart));
        // console.log('Start at: (' + this.xO + ', ' + (this.yO - this.leftF(0)) + ')');
        for (let x = xStart; x <= xEnd; x = x + step) {
            fy = faceFunc(x);
            canvasY = this.canvasYO - fy;

            this.context.lineTo(this.canvasXO + x, canvasY);
            // console.log('\tx = ' + x + ', f(x) = ' + fy + ', y = ' + y);
        }
        this.context.lineTo(this.canvasXO + xEnd, this.canvasYO - faceFunc(xEnd));
        // console.log('End at: (' + (this.xO + this.leftDepth) + ', ' + y + ')');
        this.context.stroke();
    }
}