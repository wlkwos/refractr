
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
function drawLensFace(context: CanvasRenderingContext2D,
    xStart: number, xEnd: number, yCt: number,
    f: Function, reverse: boolean=false, resolution: number=1000) {

    if (xStart < 0)
        throw new Error('Required that xStart >= 0; given ' + xStart);
    
    if (xEnd < 0)
        throw new Error('Required that xEnd >= 0; given ' + xEnd);
    
    if (yCt < 0)
        throw new Error('Required that yCt >= 0; given ' + yCt);
    
    if (resolution <= 0)
        throw new Error('Required that resolution > 0; given ' + resolution);

    if (xStart > xEnd) {
        let aux = xStart;
        xStart = xEnd;
        xEnd = aux;
    }

    let step = (xEnd - xStart)/resolution;
    step = step < 1 ? 1 : step;

    if (reverse) {
        let aux = xStart;
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


    let y;
    context.beginPath();
    context.setLineDash([]);
    context.moveTo(xStart, yCt - f(0));
    console.log('Start at: (' + xStart + ', ' + (yCt - f(0)) + ')');
    for (let x = xStart; x < xEnd; x = x + step) {
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
function drawLensVertical(context: CanvasRenderingContext2D,
        xCt: number, yTop: number, yCt: number) {

    if (xCt < 0)
        throw new Error('Required that xCt >= 0; given ' + xCt);
    
    if (yTop < 0)
        throw new Error('Required that yCt >= 0; given ' + yTop);

    if (yCt < 0)
        throw new Error('Required that yCt >= 0; given ' + yCt);

    context.beginPath();
    context.moveTo(xCt, yTop);
    context.lineTo(xCt, 2*yCt - yTop);
    context.stroke();
}