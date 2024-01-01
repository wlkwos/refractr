class Refractor {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;

    constructor(canvasName: string) {
        this.canvas = document.getElementById(canvasName) as HTMLCanvasElement;
        if (this.canvas == null)
            throw new Error('cannot find element with id \'' + canvasName + '\'');

        let context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('cannot load 2d context for canvas \'' + canvasName + '\'');
        }
        this.context = context;

        // upon clicking in the canvas, show canvas coords in console
        // (for debugging purposes)
        this.canvas.addEventListener('click', (element) => {
            console.log('canvas x = ' + element.offsetX);
            console.log('canvas y = ' + element.offsetY);
        })
    }

    public getContext() {
        return this.context;
    }
}


// left face: radius = R1
// right face: radius = R2
// lens' maximum horizontal thickness = delta
function makeConvexBicircularSimulation(R1: number, R2: number, delta: number) {

}

document.addEventListener('DOMContentLoaded', () => {
    let refractor = new Refractor('kanvas');
    // vert coord of horz line (symm axis of lens section)
    let yCt = 350;
    // horz coord of start of lens (leftmost limit)
    let xStart = 300;
    // xStart & yCt serve as coord for the origin of
    // the xOy system in which the lens functions are defined

    // refraction coeff of lens glass
    let k = 2;

    // radius of circle that describes the first face
    let R1 = 400;
    // horz thickness of first lens face
    let depth1 = 100;

    // check if possible, given known R1 & depth1
    // R2 > sqrt(depth1*(2R1 - depth1)) must be true
    let condition1 = depth1*(2*R1 - depth1);
    console.log('condition1 = ' + condition1);
    if (condition1 < 0) {
        throw Error('Cannot define a lens with R1 = ' + R1 + ', depth1 = ' + depth1);
    }

    let R2 = 300;

    let condition2 = Math.sqrt(condition1);
    console.log('condition2 = ' + condition2);
    if (R2 <= condition2) {
        throw Error('Cannot define a lens with R1 = ' + R1 + ', depth1 = ' + depth1 + ', R2 = ' + R2);
    }

    // console.log('deltaR = ' + deltaR + ', reverseDepth1Sq = ' + reverseDepth1Sq);
    // let d2 = - depth1 - Math.sqrt(deltaR + reverseDepth1Sq);
    let d2 = - depth1 + Math.sqrt(depth1**2 + R2**2 - 2*depth1*R1);

    console.log('delta = ' + d2);
    let depth2 = R2 - (d2 + depth1);
    console.log('depth2 = ' + depth2);

    let f = circularRd(R1, R1);
    let fPrime = circularPrimeRd(R1, R1);
    let fInverse = circularInverseRd(R1, R1);
    let leftFace = new FunctionTriplet(f, fPrime, fInverse, 0, R1);

    let f2 = circularRd(R2, -d2);
    let f2Prime = circularPrimeRd(R2, -d2);

    let sim = new AnalyticSimulation(refractor.getContext(), 300, 350);
    sim.specifyLens(100, leftFace, leftFace);
    sim.drawLens();

    // let sim = new AnalyticSimulationOld(refractor.getContext(), xStart, yCt);
    // sim.addLeftFace(depth1, f, fPrime, fInverse);
    // sim.addRightFace(depth2, f2, f2Prime, null);
    // sim.drawDiagram();
});
