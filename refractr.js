var AnalyticFunctionTriplet = /** @class */ (function () {
    function AnalyticFunctionTriplet(f, fPrime, fInverse, checkPoints) {
        this.f = f;
        var n = checkPoints.length;
        if (n === 0)
            throw Error('No checkpoints provided!');
        for (var i = 0; i < n; i++) {
            var p = checkPoints[i];
            if (p.length !== 2)
                throw Error('Checkpoint [' + p + '] is not a point');
            var x = p[0];
            var y = p[1];
            var tolerance = 0.0001;
            var fx = f(x);
            if (!approxEquals(fx, y, tolerance))
                throw Error('f(' + x + ') = ' + fx + ' != ' + y);
            var tangent = (f(x + Math.pow(tolerance, 2)) - f(x)) / Math.pow(tolerance, 2);
            var fprimex = fPrime(x);
            console.log(fprimex, tangent);
            if (!approxEquals(fprimex, tangent, tolerance))
                throw Error('fPrime(' + x + ') = ' + fprimex +
                    ' doesn\'t match tangent  = ' + tangent);
            var finversey = fInverse(y);
            if (!approxEquals(finversey, x))
                throw Error('fInverse(y) = ' + finversey + ' doesn\'t match x = ' + x);
        }
        this.fInverse = fInverse;
        this.fPrime = fPrime;
    }
    return AnalyticFunctionTriplet;
}());
/**
 * Create a function that describes a semicircle
 * starting at (-R + d, 0), peaking at (d, R), and
 * ending at (R + d, 0).
 * @param R semicircle radius
 */
var circularRd = function (R, d) {
    var f = function (x) {
        x = x - d;
        return Math.sqrt(Math.pow(R, 2) - Math.pow(x, 2));
    };
    return f;
};
// derivative of circularRd
var circularPrimeRd = function (R, d) {
    var fPrime = function (x) {
        x = x - d;
        return (-x) / Math.sqrt(Math.pow(R, 2) - Math.pow(x, 2));
    };
    return fPrime;
};
// inverse of circularRd
var circularInverseRd = function (R, d) {
    var fInverse = function (x) {
        // consider function's domain = (0; R)
        return R - Math.sqrt(Math.pow(R, 2) - Math.pow(x, 2));
    };
    return fInverse;
};
/**
 * Draw a curve on the canvas, representing the profile
 * of a face of the lens.
 * The function will be evaluated on the interval
 * [0, xEnd - xStart] and graph drawn between
 * (xStart, yCt - f(0)) & (xEnd, yCt - f(xEnd - xStart))
 * on the canvas.
 *
 * @param xStart: x coordinate of one end of the line
 * @param xEnd: x coordinate of the other end of the line
 * @param yCt: y coordinate of the lens' horizontal symmetry line
 * @param f: function describing the lens' curvature
 * @param resolution: the number of points to draw per lens half
 */
function drawLensFace(context, xStart, xEnd, yCt, f, reverse, resolution) {
    if (reverse === void 0) { reverse = false; }
    if (resolution === void 0) { resolution = 1000; }
    if (xStart < 0)
        throw new Error('Required that xStart >= 0; given ' + xStart);
    if (xEnd < 0)
        throw new Error('Required that xEnd >= 0; given ' + xEnd);
    if (yCt < 0)
        throw new Error('Required that yCt >= 0; given ' + yCt);
    if (resolution <= 0)
        throw new Error('Required that resolution > 0; given ' + resolution);
    if (xStart > xEnd) {
        var aux = xStart;
        xStart = xEnd;
        xEnd = aux;
    }
    var step = (xEnd - xStart) / resolution;
    step = step < 1 ? 1 : step;
    if (reverse) {
        var aux = xStart;
        xStart = xEnd;
        xEnd = aux;
        step = -step;
    }
    // horizontal axis, y = yCt
    // context.beginPath();
    // context.moveTo(xStart - 150, yCt);
    // context.setLineDash([5, 5]);
    // context.lineTo(xEnd + 300, yCt);
    // context.stroke();
    var y;
    context.beginPath();
    context.setLineDash([]);
    context.moveTo(xStart, yCt - f(0));
    console.log('Start at: (' + xStart + ', ' + (yCt - f(0)) + ')');
    for (var x = xStart; x < xEnd; x = x + step) {
        y = yCt - f(x - xStart);
        context.lineTo(x, y);
    }
    console.log('End at: (' + xEnd + ', ' + y + ')');
    context.stroke();
}
/**
 * Draw lens surface for the special case that
 * it is a straight vertical line.
 * @param xCt: x coordinate for all points on the line
 * @param yTop: y coordinate for the highest point on the line
 * @param yCt: y coordinate of the lens' horizontal symmetry line
 */
function drawLensVertical(context, xCt, yTop, yCt) {
    if (xCt < 0)
        throw new Error('Required that xCt >= 0; given ' + xCt);
    if (yTop < 0)
        throw new Error('Required that yCt >= 0; given ' + yTop);
    if (yCt < 0)
        throw new Error('Required that yCt >= 0; given ' + yCt);
    context.beginPath();
    context.moveTo(xCt, yTop);
    context.lineTo(xCt, 2 * yCt - yTop);
    context.stroke();
}
/**
 * Define a triplet containing a bijective function, its derivative,
 * its inverse, and its domain & codomain. Domain and codomain must
 * be finite.
 */
var FunctionTriplet = /** @class */ (function () {
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
    function FunctionTriplet(f, fPrime, fInverse, d1, d2) {
        var _this = this;
        if (!f)
            throw new Error('f is missing');
        if (d1 >= d2)
            throw new Error("Required that d1 [".concat(d1, "] < d2 [").concat(d2, "]"));
        var c1 = f(d1);
        var c2 = f(d2);
        if (c1 === c2)
            throw new Error('f is not strictly monotonous');
        this.d1 = d1;
        this.d2 = d2;
        if (c1 < c2) {
            this.c1 = c1;
            this.c2 = c2;
        }
        else {
            this.c1 = c2;
            this.c2 = c1;
        }
        this.f = function (x) {
            _this.assertIsInDomain(x);
            return f(x);
        };
        var _fPrime = fPrime ? fPrime : generateDerivative(f);
        this.fPrime = function (x) {
            _this.assertIsInDomain(x);
            return _fPrime(x);
        };
        var _fInverse = fInverse ? fInverse : generateInverse(f, d1, d2);
        this.fInverse = function (y) {
            _this.assertIsInCodomain(y);
            return _fInverse(y);
        };
    }
    FunctionTriplet.prototype.shiftRight = function (delta) {
        var _this = this;
        var newF = function (x) { return _this.f(x - delta); };
        var newD1 = this.d1 + delta;
        var newD2 = this.d2 + delta;
        return new FunctionTriplet(newF, generateDerivative(newF), generateInverse(newF, newD1, newD2), newD1, newD2);
    };
    FunctionTriplet.prototype.assertIsInDomain = function (x) {
        if ((x < this.d1) || (x > this.d2))
            throw new Error("".concat(x, " not within [").concat(this.d1, ", ").concat(this.d2, "]"));
    };
    FunctionTriplet.prototype.assertIsInCodomain = function (y) {
        if ((y < this.c1) || (y > this.c2))
            throw new Error("".concat(y, " not within [").concat(this.c1, ", ").concat(this.c2, "]"));
    };
    return FunctionTriplet;
}());
var Refractor = /** @class */ (function () {
    function Refractor(canvasName) {
        this.canvas = document.getElementById(canvasName);
        if (this.canvas == null)
            throw new Error('cannot find element with id \'' + canvasName + '\'');
        var context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('cannot load 2d context for canvas \'' + canvasName + '\'');
        }
        this.context = context;
        // upon clicking in the canvas, show canvas coords in console
        this.canvas.addEventListener('click', function (element) {
            console.log('canvas x = ' + element.offsetX);
            console.log('canvas y = ' + element.offsetY);
        });
    }
    Refractor.prototype.getContext = function () {
        return this.context;
    };
    return Refractor;
}());
// left face: radius = R1
// right face: radius = R2
// lens' maximum horizontal thickness = delta
function makeConvexBicircularSimulation(R1, R2, delta) {
}
document.addEventListener('DOMContentLoaded', function () {
    var refractor = new Refractor('kanvas');
    // vert coord of horz line (symm axis of lens)
    var yCt = 350;
    // horz coord of start of lens
    var xStart = 300;
    // together xStart & yCt define the "origin" of lens
    // refraction coeff of lens glass
    var k = 2;
    // radius of circle that describes the first face
    var R1 = 400;
    // horz thickness of first lens face
    var depth1 = 100;
    // check if possible, given known R1 & depth1
    // R2 > sqrt(depth1*(2R1 - depth1)) must be true
    var condition1 = depth1 * (2 * R1 - depth1);
    console.log('condition1 = ' + condition1);
    if (condition1 < 0) {
        throw Error('Cannot define a lens with R1 = ' + R1 + ', depth1 = ' + depth1);
    }
    var R2 = 300;
    var condition2 = Math.sqrt(condition1);
    console.log('condition2 = ' + condition2);
    if (R2 <= condition2) {
        throw Error('Cannot define a lens with R1 = ' + R1 + ', depth1 = ' + depth1 + ', R2 = ' + R2);
    }
    // console.log('deltaR = ' + deltaR + ', reverseDepth1Sq = ' + reverseDepth1Sq);
    // let d2 = - depth1 - Math.sqrt(deltaR + reverseDepth1Sq);
    var d2 = -depth1 + Math.sqrt(Math.pow(depth1, 2) + Math.pow(R2, 2) - 2 * depth1 * R1);
    console.log('delta = ' + d2);
    var depth2 = R2 - (d2 + depth1);
    console.log('depth2 = ' + depth2);
    var f = circularRd(R1, R1);
    var fPrime = circularPrimeRd(R1, R1);
    var fInverse = circularInverseRd(R1, R1);
    var leftFace = new FunctionTriplet(f, fPrime, fInverse, 0, R1);
    var f2 = circularRd(R2, -d2);
    var f2Prime = circularPrimeRd(R2, -d2);
    var sim = new AnalyticSimulation(refractor.getContext(), 300, 350);
    sim.specifyLens(100, leftFace, leftFace);
    sim.drawLens();
    // let sim = new AnalyticSimulationOld(refractor.getContext(), xStart, yCt);
    // sim.addLeftFace(depth1, f, fPrime, fInverse);
    // sim.addRightFace(depth2, f2, f2Prime, null);
    // sim.drawDiagram();
});
var AnalyticSimulationOld = /** @class */ (function () {
    /**
     *
     * @param context
     * @param xO
     * @param yO
     */
    function AnalyticSimulationOld(context, xO, yO) {
        this.context = context;
        this.xO = xO;
        this.yO = yO;
    }
    AnalyticSimulationOld.prototype.addLeftFace = function (depth, f, fPrime, fInverse) {
        if (f(0) !== 0)
            throw new Error('Expected f(0) = 0, but ' + f(0) + ' =/= 0');
        this.leftF = f;
        this.leftFPrime = fPrime;
        this.leftFInverse = fInverse;
        this.leftDepth = depth;
    };
    AnalyticSimulationOld.prototype.addRightFace = function (depth, f, fPrime, fInverse) {
        this.rightF = f;
        this.rightFPrime = fPrime;
        this.rightFInverse = fInverse;
        this.rightDepth = depth;
        console.log('this.leftDepth = ' + this.leftDepth);
        console.log('this.rightDepth = ' + this.rightDepth);
        if (f(this.leftDepth + this.rightDepth) !== 0)
            throw new Error('Expected g(leftDepth + rightDepth) = 0, but '
                + f(this.leftDepth + this.rightDepth) + ' =/= 0');
    };
    AnalyticSimulationOld.prototype.drawDiagram = function () {
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
    };
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
    AnalyticSimulationOld.prototype.drawLeftLensFace = function (resolution) {
        if (resolution === void 0) { resolution = 1000; }
        var step = (this.leftDepth + this.rightDepth) / resolution;
        step = step < 1 ? 1 : step;
        console.log('leftDepth = ' + this.leftDepth
            + ', rightDepth = ' + this.rightDepth
            + ', step = ' + step);
        var y, fy;
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.moveTo(this.xO, this.yO - this.leftF(0));
        console.log('Start at: (' + this.xO + ', ' + (this.yO - this.leftF(0)) + ')');
        for (var x = 0; x <= this.leftDepth; x = x + step) {
            fy = this.leftF(x);
            y = this.yO - fy;
            this.context.lineTo(this.xO + x, y);
            // console.log('\tx = ' + x + ', f(x) = ' + fy + ', y = ' + y);
        }
        this.context.lineTo(this.xO + this.leftDepth, this.yO - this.leftF(this.leftDepth));
        // console.log('End at: (' + (this.xO + this.leftDepth) + ', ' + y + ')');
        this.context.stroke();
    };
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
    AnalyticSimulationOld.prototype.drawRightLensFace = function (resolution) {
        if (resolution === void 0) { resolution = 1000; }
        var leftY = this.leftF(this.leftDepth);
        var rightY = this.rightF(this.leftDepth);
        if (!approxEquals(leftY, rightY)) {
            throw new Error('Expected f('
                + this.leftDepth + ') = g('
                + this.leftDepth + '), but '
                + leftY + ' =/= ' + rightY);
        }
        var step = (this.leftDepth + this.rightDepth) / resolution;
        step = step < 1 ? 1 : step;
        var y, fy;
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.moveTo(this.xO + this.leftDepth, this.yO - this.rightF(this.leftDepth));
        console.log('Start at: (' + (this.xO + this.leftDepth) + ', '
            + (this.yO - this.rightF(this.leftDepth)) + ')');
        var x;
        for (x = this.leftDepth + step; x <= this.leftDepth + this.rightDepth; x = x + step) {
            fy = this.rightF(x);
            y = this.yO - fy;
            this.context.lineTo(this.xO + x, y);
            console.log('\tx = ' + x + ', f(x) = ' + fy + ', y = ' + y);
        }
        this.context.lineTo(this.xO + this.leftDepth + this.rightDepth, this.yO - this.rightF(this.leftDepth + this.rightDepth));
        console.log('End at: (' + (this.xO + x) + ', ' + y + ')');
        this.context.stroke();
    };
    /**
     *
     * @param R
     * @param lensDepth
     * @param k: lens glass refraction coeff
    *      (= speed of light vacuum/speed of light in glass)
     */
    AnalyticSimulationOld.prototype.simpleHalfConvexSim = function (R, checkPoints, lensDepth, k) {
        var f = function (x) {
            x = x - R;
            return Math.sqrt(Math.pow(R, 2) - Math.pow(x, 2));
        };
        var fPrime = function (x) {
            x = x - R;
            return (-x) / Math.sqrt(Math.pow(R, 2) - Math.pow(x, 2));
        };
        var fInverse = function (x) {
            // consider function's domain = (0; R)
            return R - Math.sqrt(Math.pow(R, 2) - Math.pow(x, 2));
        };
        var yTop = f(lensDepth);
        drawLensFace(this.context, this.xO, this.xO + lensDepth, this.yO, f);
        drawLensVertical(this.context, this.xO + lensDepth, this.yO - yTop, this.yO);
        var y1 = yTop / 5;
        this.startFrom(-150, y1);
        var funx = new AnalyticFunctionTriplet(f, fPrime, fInverse, checkPoints);
        var x1 = funx.fInverse(y1);
        this.drawTo(x1, y1);
        this.context.stroke();
    };
    AnalyticSimulationOld.prototype.startFrom = function (x, y) {
        this.context.beginPath();
        this.context.moveTo(this.xO + x, this.yO - y);
    };
    AnalyticSimulationOld.prototype.drawTo = function (x, y) {
        this.context.lineTo(this.xO + x, this.yO - y);
    };
    return AnalyticSimulationOld;
}());
/**
 * Start with the constructor:
 * establish the drawing space: the canvas context and the point of origin;
 *
 * then define the lens: tau, the maximum horizontal thickness,
 * and the functions describing the curvatures of the faces;
 * both should be 0 at x = 0
 */
var AnalyticSimulation = /** @class */ (function () {
    /**
     *
     * @param context
     * @param xO
     * @param yO
     */
    function AnalyticSimulation(context, xO, yO) {
        this.context = context;
        assertStrictlyPositive(xO, 'xO');
        this.canvasXO = xO;
        assertStrictlyPositive(yO, 'yO');
        this.canvasYO = yO;
    }
    AnalyticSimulation.prototype.specifyLens = function (tau, leftFace, rightFace) {
        assertStrictlyPositive(tau, 'tau');
        this.tau = tau;
        if (!(leftFace.f(0) == 0)) {
            throw new Error("Required that leftFace(0) [=".concat(leftFace.f(0), "] = 0"));
        }
        this.leftFace = leftFace;
        if (!(rightFace.f(0) == 0)) {
            throw new Error("Required that rightFace(0) [=".concat(rightFace.f(0), "] = 0"));
        }
        this.rightFace = rightFace.shiftRight(tau);
    };
    AnalyticSimulation.prototype.drawLens = function () {
        // TODO
        // check both faces set
        // calculate intersection of left and right faces
        // erase canvas
        // draw left face, x in [xO, xIntersect]
        this.xIntersect = 100;
        this.drawFace(this.leftFace.f, 0, this.xIntersect);
    };
    AnalyticSimulation.prototype.drawFace = function (faceFunc, xStart, xEnd, resolution) {
        if (resolution === void 0) { resolution = 1000; }
        var step = (xStart + xEnd) / resolution;
        step = step < 1 ? 1 : step;
        var canvasY, fy;
        this.context.beginPath();
        this.context.setLineDash([]);
        this.context.moveTo(this.canvasXO + xStart, this.canvasYO - faceFunc(xStart));
        // console.log('Start at: (' + this.xO + ', ' + (this.yO - this.leftF(0)) + ')');
        for (var x = xStart; x <= xEnd; x = x + step) {
            fy = faceFunc(x);
            canvasY = this.canvasYO - fy;
            this.context.lineTo(this.canvasXO + x, canvasY);
            // console.log('\tx = ' + x + ', f(x) = ' + fy + ', y = ' + y);
        }
        this.context.lineTo(this.canvasXO + xEnd, this.canvasYO - faceFunc(xEnd));
        // console.log('End at: (' + (this.xO + this.leftDepth) + ', ' + y + ')');
        this.context.stroke();
    };
    return AnalyticSimulation;
}());
/** Check a & b are equal, within tolerance t.
 */
function approxEquals(a, b, t) {
    if (t === void 0) { t = Math.pow(10, (-11)); }
    return (a < b + t) && (a > b - t);
}
function assertStrictlyPositive(n, label) {
    if (n <= 0)
        throw new Error("Required that ".concat(label, " (=").concat(n, ") > 0"));
}
/**
 * @param f a function that should be derivable
 * @returns a function that numerically approximates the derivative of f
 */
function generateDerivative(f) {
    var infinitesimal = Math.pow(10, (-10));
    return function (x) {
        return (f(x + infinitesimal) - f(x - infinitesimal))
            / (2 * infinitesimal);
    };
}
/**
 * @param f a function monotonous over the domain
 * @param xStart lower bound of f's domain
 * @param xEnd upper bound of f's domain
 * @returns a function that numerically approximates the inverse of f
 * over domain [xStart, xEnd]
 */
function generateInverse(f, xStart, xEnd) {
    if (xEnd <= xStart)
        throw new Error("Invalid domain bounds: (".concat(xStart, ", ").concat(xEnd, ")"));
    if (f(xStart) === f(xEnd))
        throw new Error("Expected a monotonous function, but end values are equal");
    return function (y) {
        var l1;
        var l2;
        if (f(xStart) < f(xEnd)) {
            l1 = xStart;
            l2 = xEnd;
        }
        else {
            l1 = xEnd;
            l2 = xStart;
        }
        var m;
        var fm;
        do {
            m = (l1 + l2) / 2;
            fm = f(m);
            if (approxEquals(fm, y))
                return m;
            if (y < fm)
                l2 = m;
            else
                l1 = m;
        } while (true);
    };
}
