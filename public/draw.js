//TODO: more sky gradients (different times)
//TODO: clouds
//TODO: more attributes and pretty versions of moon size and speed values

// |||| FUNCTIONS ||||
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
function randomGrayscale(min, max) {
    if (!min) {
        min = 0;
    }
    if (!max) {
        max = 255;
    }
    let a = randInt(min, max);
    return [a, a, a];
}
function handleCanvas(windowWidth, windowHeight, isFxpreview) {
    if (!windowWidth || !windowHeight) {
        return false;
    }
    if (isFxpreview) {
        return createCanvas(windowWidth, windowHeight);
    }
    let ret;
    if (windowWidth < windowHeight) {
        let square = returnSmaller(windowWidth, windowHeight);
        ret = createCanvas(square, square);
    } else {
        ret = createCanvas(windowWidth, windowHeight);
    }
    return ret;
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
function playPause() {
    if (isLooping()) {
        noLoop();
    } else {
        loop();
    }
}
//data functions
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
function setupBuildings(numBuildings, buildings, lightsOdds, append = false) {
    if (!numBuildings || numBuildings <= 0) {
        return false;
    }
    if (!buildings || buildings.length <= 0) {
        buildings = [];
    }
    for (let i = 0; i < numBuildings; i++) {
        let buildingWidth = randRange(100, 400);
        let buildingHeight = randRange(200, 800);
        let buildingX;
        if (append) {
            buildingX = width;
        } else {
            buildingX = randRange(0 - buildingWidth, width + buildingWidth);
        }
        let buildingY = height - buildingHeight;
        let buildingWindows = [];
        let aspectRatio = randInt(1, 3);
        let wwid = randInt(buildingWidth / 15, buildingWidth / 10);
        let whei = (wwid * aspectRatio) / 1.5;
        let windowCount = Math.floor(buildingWidth / wwid) - 1;
        let remainder = buildingWidth - wwid * windowCount;
        let spaceBetweenWindows = remainder / (windowCount + 1);
        for (let j = spaceBetweenWindows; j < buildingHeight - spaceBetweenWindows; j += whei + spaceBetweenWindows) {
            for (
                let k = spaceBetweenWindows;
                k < buildingWidth - spaceBetweenWindows;
                k += wwid + spaceBetweenWindows
            ) {
                buildingWindows.push({
                    x: k,
                    y: j,
                    width: wwid,
                    height: whei,
                    isLit: fxrand() > lightsOdds,
                    opacity: randRange(0.8, 1),
                    color: randInt(35, 80),
                });
            }
        }
        buildings.push({
            width: buildingWidth,
            height: buildingHeight,
            // x: -1000,
            x: buildingX,
            y: buildingY,
            windows: buildingWindows,
            color: randInt(35, 40),
        });
    }
    return buildings;
}
function cleanBuildings(buildings) {
    if (!buildings || buildings.length <= 0) {
        return false;
    }
    let retBuildings = [];
    for (let i = 0; i < buildings.length; i++) {
        if (buildings[i].x >= -buildings[i].width) {
            retBuildings.push(buildings[i]);
        } else {
            let temp = setupBuildings(1, false, lightsOdds, true);
            retBuildings.push(temp[0]);
        }
    }
    return retBuildings;
}
function setupClouds(numClouds, theClouds, append = false) {
    if (!numClouds || numClouds <= 0) {
        return false;
    }
    if (!theClouds || theClouds.length <= 0) {
        theClouds = [];
    }
    for (let i = 0; i < numClouds; i++) {
        //for each cloud in clouds
        let cloudY = randRange(-40, height - 200);
        let cloudX = randRange(0, width);
        let cloudColor = randomGrayscale(175, 255);
        let cloudAlpha = randRange(0.001, 0.05);
        if (append) {
            cloudX = width + 100;
        }
        let package = [];
        let groupSize = randInt(80, 300);
        let noiseMod = 0;
        for (let g = 0; g < groupSize; g++) {
            let puffR = randRange(5, 20);
            let puffN = puffR * randRange(0.5, 1.5);
            let puffX = randRange(cloudX - puffR * 6, cloudX + puffR * 6);
            let puffY = randRange(cloudY - puffR * 2.25, cloudY + puffR * 2.25);
            package.push({
                x: puffX,
                y: puffY,
                r: puffR,
                n: puffN,
            });
        }
        theClouds.push({
            x: cloudX,
            y: cloudY,
            rgb: cloudColor,
            alpha: cloudAlpha,
            speedMod: randRange(0.001, 0.05),
            bundle: groupSize,
            payload: package,
        });
    }
    return theClouds;
}
function cleanClouds(theClouds) {
    if (!theClouds || theClouds.length <= 0) {
        return false;
    }
    let retClouds = [];
    for (let cs = 0; cs < theClouds.length; cs++) {
        let tempPf = [];
        for (pf = 0; pf < theClouds[cs].bundle; pf++) {
            if (
                theClouds[cs].payload[pf].x > -theClouds[cs].payload[pf].r - 200 &&
                theClouds[cs].payload[pf].x < width + theClouds[cs].payload[pf].r + 200 &&
                theClouds[cs].payload[pf].y > -theClouds[cs].payload[pf].r - 200 &&
                theClouds[cs].payload[pf].y < height + theClouds[cs].payload[pf].r + 200
            ) {
                //poof is on canvas
                tempPf.push(theClouds[cs].payload[pf]);
            }
        }
        if (tempPf.length <= 0) {
            let newCloud = setupClouds(1, [], true);
            retClouds.push(newCloud[0]);
        } else {
            retClouds.push(theClouds[cs]);
        }
    }
    return retClouds;
}
//shape functions
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

// |||| VARIABLES ||||
//utility variables
let dsearch = new URLSearchParams(window.location.search);
let gradients = {
    Horizontal: "h",
    Vertical: "v",
    Radial: "r",
};
let bgGrads = {
    Sunset: Array([8, 24, 58], [21, 40, 82], [75, 61, 96], [253, 94, 83], [252, 156, 84], [255, 227, 115]),
    Red: Array([81, 50, 82], [122, 64, 105], [202, 78, 121], [255, 193, 142]),
    Morning: Array([6, 40, 61], [19, 99, 223], [71, 181, 255], [223, 246, 255]),
    Pink: Array([185, 243, 252], [174, 226, 255], [147, 198, 231], [254, 222, 255]),
    Purples: Array([46, 2, 73], [87, 10, 87], [169, 16, 121], [248, 6, 204]),
};
let theGrad;
let theMoon;

//drawing variables
let colors = Array();
let gradBgPicker = randInt(0, Object.keys(bgGrads).length);
let gradBgType = Object.keys(bgGrads)[gradBgPicker];
let gradBgTypeCode = Object.values(bgGrads)[gradBgPicker];
let theGradOffset = randRange(-400, 400);
let buildings = [];
let numBuildings = randInt(2, 10);
let lightsOdds = fxrand();
let theSpeed = randRange(3, 7);
let roadMarkings = [];
let markingSpeed = -1 * theSpeed;
let guardRailPosts = [];
let postSpeed = -1 * theSpeed;
let sf_moonDiameter = randRange(50, 150);
let sf_moonX;
let sf_moonY;
let sf_moonAngle = randRange(1, 250);
let sf_moonSpeed = fxrand() / 10000;
let moonColorLight = "255, 255, 255";
let moonColorDark = "255, 227, 115";
let numClouds = randInt(3, 16);
let theClouds = [];
let cloudSpeedBase = fxrand() * 0.05;
let cloudLeftBias = fxrand();
let cloudUpBias = fxrand();

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

function setup() {
    if (!isFxpreview) {
        document.getElementById("insert-prop-hash").textContent = String(fxhash);
        document.getElementById("insert-prop-numBuildings").textContent = numBuildings;
        document.getElementById("insert-prop-moonDiameter").textContent = sf_moonDiameter;
        document.getElementById("insert-prop-moonSpeed").textContent = sf_moonSpeed;
        // document.getElementById("insert-prop-eye").textContent = eyeType;
        // document.getElementById("insert-prop-colors").textContent = numColors;
        // document.getElementById("insert-prop-hypno").textContent = hypnoDir;
        // document.getElementById("insert-prop-cyclops").textContent = String(isCyclops).toUpperCase();
        // document.getElementById("insert-prop-stars").textContent = starriness;
    } else {
        // this is an fxhash preview run
        document.getElementById("legend").classList.remove("open");
        document.getElementById("legend-button").classList.add("hide");
    }

    let biggestSquare = returnSmaller(windowWidth, windowHeight);
    theCanvas = handleCanvas(biggestSquare, biggestSquare, isFxpreview);

    randomSeed(fxhash);
    noiseSeed(fxrand());
    console.log(fxhash);

    // FX Features
    window.$fxhashFeatures = {
        Buildings: numBuildings,
    };

    // background("skyblue"); // change the background color to skyblue
    theGrad = setupGradient("v", windowHeight - theGradOffset, windowWidth, gradBgTypeCode);
    theMoon = setupGradient("v", windowHeight - 100, windowWidth, Array(moonColorLight, moonColorDark));
    buildings = setupBuildings(numBuildings, buildings, lightsOdds);
    theClouds = setupClouds(numClouds, theClouds);

    let markWidth = randInt(15, 30);
    // let numMarks = Math.floor(width / markWidth) * 0.65;
    let numMarks = randInt(4, 8);
    let remainderSpace = width - numMarks * markWidth;
    let spaceBetweenMarks = remainderSpace / (numMarks + 1);
    for (let i = spaceBetweenMarks; i < width - spaceBetweenMarks; i += markWidth + spaceBetweenMarks) {
        roadMarkings.push({
            x: i,
            y: height - 50,
            width: markWidth,
            height: 5,
        });
    }

    for (let i = 0; i < width; i += 50) {
        guardRailPosts.push({
            x: i + 10,
            y: height - 150,
            width: 10,
            height: 50,
        });
    }
}

function draw() {
    clear(); //reset canvas
    theGrad = setupGradient("v", windowHeight - theGradOffset, windowWidth, gradBgTypeCode);
    //bg gradient
    push();
    drawingContext.save();
    drawingContext.fillStyle = theGrad;
    rect(0, 0, width, height);
    drawingContext.restore();
    pop();

    //moon
    push();
    noStroke();
    drawingContext.save();
    drawingContext.shadowBlur = 80;
    let moonCenterY = sf_moonY + sf_moonDiameter / 2;
    let lerpAmount = map(moonCenterY, sf_moonY, sf_moonY + sf_moonDiameter, 0, 1);
    let gradientColor = lerpColor(color(moonColorLight), color(moonColorDark), lerpAmount);
    drawingContext.shadowColor = gradientColor;
    drawingContext.fillStyle = theMoon;
    sf_moonX = width / 2 + (width / 2 - sf_moonDiameter / 2) * cos(sf_moonAngle);
    sf_moonY = height + (height - sf_moonDiameter / 2) * sin(sf_moonAngle);
    sf_moonAngle += sf_moonSpeed;
    ellipse(sf_moonX, sf_moonY, sf_moonDiameter);
    drawingContext.restore();
    pop();

    //clouds
    push();
    drawingContext.save();
    noStroke();
    for (let cs = 0; cs < theClouds.length; cs++) {
        fill("rgba(" + theClouds[cs].rgb + "," + noise(theClouds[cs].alpha) + ")");
        for (pf = 0; pf < theClouds[cs].bundle; pf++) {
            rect(
                theClouds[cs].payload[pf].x,
                theClouds[cs].payload[pf].y,
                theClouds[cs].payload[pf].r,
                theClouds[cs].payload[pf].n
            );
            if (cloudLeftBias > 0.2) {
                theClouds[cs].payload[pf].x -= noise(cloudSpeedBase * theClouds[cs].speedMod);
            } else {
                theClouds[cs].payload[pf].x += noise(cloudSpeedBase * theClouds[cs].speedMod);
            }
            if (fxrand() > 0.75) {
                if (cloudUpBias > 0.2) {
                    theClouds[cs].payload[pf].y -= noise(cloudSpeedBase + theClouds[cs].speedMod);
                } else {
                    theClouds[cs].payload[pf].y += noise(cloudSpeedBase - theClouds[cs].speedMod);
                }
                if (fxrand() > 0.5) {
                    theClouds[cs].payload[pf].n += noise(cloudSpeedBase * theClouds[cs].speedMod);
                    theClouds[cs].alpha += 0.0;
                } else {
                    theClouds[cs].payload[pf].n -= noise(cloudSpeedBase * theClouds[cs].speedMod);
                    theClouds[cs].alpha -= 0.0;
                }
            }
        }
    }
    drawingContext.restore();
    pop();

    //buildings
    for (let i = 0; i < buildings.length; i++) {
        fill(buildings[i].color);
        rect(buildings[i].x, buildings[i].y, buildings[i].width, buildings[i].height);
        for (let j = 0; j < buildings[i].windows.length; j++) {
            let window = buildings[i].windows[j];
            fill(
                window.isLit
                    ? "rgba(255,255,0," + buildings[i].windows[j].opacity + ")"
                    : color(buildings[i].windows[j].color)
            );
            rect(window.x + buildings[i].x, window.y + buildings[i].y, window.width, window.height);
        }
        buildings[i].x -= 0.01 * (i + 1);
    }

    //road
    //road - bg
    fill(50);
    rect(0, height - 100, width, 100); // add a road in front on the bottom
    //road - markings
    fill(255);
    for (let i = 0; i < roadMarkings.length; i++) {
        let marking = roadMarkings[i];
        rect(marking.x, marking.y, marking.width, marking.height);
        marking.x += markingSpeed;
        if (marking.x < -marking.width) {
            marking.x = width;
        }
    }
    //road - guard rail posts
    fill("rgb(150, 85, 0)");
    for (let i = 0; i < guardRailPosts.length; i++) {
        let post = guardRailPosts[i];
        rect(post.x, post.y, post.width, post.height);
        post.x += postSpeed;
        if (post.x < -post.width) {
            post.x = width;
        }
    }
    //road - guard rail wires
    for (let i = 0; i < 50; i += 20) {
        line(0, height - 150 + i, width, height - 150 + i); // add horizontal lines
    }

    //housekeeping functions (remove offscreen items from arrays and replace with new ones)
    buildings = cleanBuildings(buildings);
    theClouds = cleanClouds(theClouds);

    //random chance to flip a single window light on or off - can be nested in a loop for additional windows per frame
    if (fxrand() > 0.9) {
        let randomBuildingIndex = randInt(0, buildings.length);
        let randomWindowIndex = randInt(0, buildings[randomBuildingIndex].windows.length);
        buildings[randomBuildingIndex].windows[randomWindowIndex].isLit =
            !buildings[randomBuildingIndex].windows[randomWindowIndex].isLit;
    }
    theGradOffset -= cos(theSpeed * frameCount);
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
    if (key.toLowerCase() == "s") {
        save("cityscape.png");
    } else if (key.toLowerCase() == "p") {
        playPause();
    }
}

function windowResized() {
    // theCanvas = handleCanvas(windowWidth, windowHeight);
}
