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
function pickRandomColor(colors) {
    return colors[randInt(0, colors.length)];
}

//setup variables

function setup() {
    createCanvas(windowWidth, windowHeight);

    seed = randInt(0, 100000000); // FXHASH seed rand
    randomSeed(seed);

    col = randomRGB();
    bg = randomGrayscale();
    sizee = int(randInt(width / 64, width / 2));

    // FX Features
    window.$fxhashFeatures = {
        Size: sizee,
        Color: col,
    };
}

function draw() {
    background(bg);

    stroke(0);
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
