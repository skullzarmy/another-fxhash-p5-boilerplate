//utility functions
function randInt(min, max) {
    return Math.floor(fxrand() * (max - min) + min);
}
function randRange(min, max) {
    return fxrand() * (max - min) + min;
}
function randomRGB() {
    let a = randInt(0, 255);
    let b = randInt(0, 255);
    let c = randInt(0, 255);
    return [a, b, c];
}
function randomGrayscale() {
    let a = randInt(0, 255);
    return [a, a, a];
}
function setupColors(numColors, grayscale, addBlack, addWhite) {
    let colors = Array();
    if (!grayscale) {
        for (let i = colors.length; i < numColors; i++) {
            colors.push(randomRGB());
        }
        if (addWhite) {
            colors.unshift([255, 255, 255]);
        }
        if (addBlack) {
            colors.unshift([0, 0, 0]);
        }
    } else {
        for (let i = colors.length; i < numColors; i++) {
            colors.push(randomGrayscale());
        }
    }
    return colors;
}
function setupGradient(gradType, gradHeight, gradWidth, colors) {
    if (!gradType || !colors) {
        return false;
    }
    let theGrad;
    if (gradType == "v") {
        theGrad = drawingContext.createLinearGradient(0, 0, 0, gradHeight * 1.2);
    } else if (gradType == "h") {
        theGrad = drawingContext.createLinearGradient(0, 0, gradWidth * 1.2, 0);
    } else if (gradType == "r") {
        theGrad = drawingContext.createRadialGradient(
            gradWidth / 2,
            gradHeight / 2,
            0,
            gradWidth / 2,
            gradHeight / 2,
            gradWidth
        );
    }

    for (let l = 0; l < colors.length; l++) {
        theGrad.addColorStop(l * (1 / colors.length), "rgb(" + colors[l] + ")");
    }

    return theGrad;
}
function pickRandomColor(colors) {
    return colors[randInt(0, colors.length)];
}
function returnLarger(a, b) {
    if (!a || !b) {
        return false;
    } else if (a >= b) {
        return a;
    } else {
        return b;
    }
}
function returnSmaller(a, b) {
    if (!a || !b) {
        return false;
    } else if (a <= b) {
        return a;
    } else {
        return b;
    }
}
//drawing functions
function heart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}
function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}
//utility variables
let gradients = {
    Horizontal: "h",
    Vertical: "v",
    Radial: "r",
};
//setup variables
let colors = Array();
let gradBgPicker = randInt(0, Object.keys(gradients).length);
let gradBgType = Object.keys(gradients)[gradBgPicker];
let gradBgTypeCode = Object.values(gradients)[gradBgPicker];

function setup() {
    createCanvas(windowWidth, windowHeight);

    seed = randInt(0, 100000000); // FXHASH seed rand
    randomSeed(seed);

    col = randomRGB();
    bg = randomGrayscale();
    strk = randomRGB();
    sizee = int(randInt(width / 64, width / 2));
    strkwt = randInt(sizee / 100, sizee / 2);

    // FX Features
    window.$fxhashFeatures = {
        Size: sizee,
        Color: col,
    };
}

function draw() {
    background(bg);

    stroke(strk);
    strokeWeight(strkwt);
    fill(col);

    rectMode(CENTER);
    rect(width / 2, height / 2, sizee, sizee);
}

function mouseClicked() {
    // prevent default
    return false;
}
function doubleClicked() {
    // prevent default
    return false;
}

function keyPressed() {
    // if (key == "s") {
    //     saveAtEnd = true;
    //     if (runs > ttl) {
    //         save("concentricity.png");
    //         saveAtEnd = false;
    //     }
    // }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
