const boxSize = 20;
let gridWidth, gridHeight, xOffset, yOffset;
let cells = [];
let cellFinder = new Map();
let cellsLoaded = false;
let simulationRunning = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(10);
    gridWidth = (windowWidth - windowWidth % boxSize) / boxSize;
    gridHeight = (windowHeight - windowHeight % boxSize) / boxSize;
    xOffset = (windowWidth % boxSize) / 2;
    yOffset = (windowHeight % boxSize) / 2;
    for (let i = xOffset; i < windowWidth; i+= boxSize) {
        line(i, 0, i, windowHeight);
    }
    for (let i = yOffset; i < windowHeight; i+= boxSize) {
        line(0, i, windowWidth, i);
    }
    for (let i = 0; i < gridWidth; i++) {
        for (let m = 0; m < gridHeight; m++) {
            cellFinder.set(`${i},${m}`, cells.length);
            cells.push(new Cell(i, m));
        }
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].neighbors = cells[i].getNeighbors();
    }
    cellsLoaded = true;
    fill(0);
    rect(0, 0, windowWidth, yOffset);
    rect(0, yOffset, xOffset, windowHeight);
    rect(windowWidth - xOffset, yOffset, windowWidth, windowHeight);
    rect(xOffset, windowHeight - yOffset, windowWidth - xOffset, windowHeight);
}

function mouseClicked(event) {
    const mX = event.clientX;
    const mY = event.clientY;
    if (cellsLoaded && mX >= 0 && mY >= 0 && mX <= windowWidth - xOffset && mY <= windowHeight - yOffset) {
        const cellX = Math.floor((mX - xOffset) / boxSize);
        const cellY = Math.floor((mY - yOffset) / boxSize);
        let mCell = cells[cellFinder.get(`${cellX},${cellY}`)];
        mCell.wasAlive = !mCell.wasAlive;
        mCell.alive = mCell.wasAlive;
    }
}

function keyPressed() {
    if (keyCode === SHIFT) {
        simulationRunning = !simulationRunning;
    }
}

function draw() {
    for (let i = 0; i < cells.length; i++) {
        if (simulationRunning) {
            cells[i].updateStatus();
        }
        if (cells[i].alive) {
            fill(0);
        } else {
            fill(255, 255, 255);
        }
        rect(cells[i].rx, cells[i].ry, boxSize, boxSize);
    }
    if (simulationRunning) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].setWas();
        }
    }
}

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.rx = xOffset + boxSize * x;
        this.ry = yOffset + boxSize * y;
        this.alive = false;
        this.wasAlive = this.alive;
        this.neighbors;
    }

    setWas() {
        this.wasAlive = this.alive;
    }

    updateStatus() {
        let aliveNeighbors = 0;
        for (let i = 0; i < this.neighbors.length; i++) {
            if (this.neighbors[i].wasAlive) {
                aliveNeighbors++;
            }
        }
        if (this.alive) {
            if (aliveNeighbors != 2 && aliveNeighbors != 3) {
                this.alive = false;
            }
        } else if (aliveNeighbors == 3) {
            this.alive = true;
        }
    }

    getNeighbors() {
        let helper = [];
        if (this.x > 0) {
            helper.push(cells[cellFinder.get(`${this.x - 1},${this.y}`)]);
            if (this.y > 0) {
                helper.push(cells[cellFinder.get(`${this.x - 1},${this.y - 1}`)]);
            }
            if (this.y < gridHeight - 1) {
                helper.push(cells[cellFinder.get(`${this.x - 1},${this.y + 1}`)]);
            }
        }
        if (this.x < gridWidth - 1) {
            helper.push(cells[cellFinder.get(`${this.x + 1},${this.y}`)]);
            if (this.y > 0) {
                helper.push(cells[cellFinder.get(`${this.x + 1},${this.y - 1}`)]);
            }
            if (this.y < gridHeight - 1) {
                helper.push(cells[cellFinder.get(`${this.x + 1},${this.y + 1}`)]);
            }
        }
        if (this.y > 0) {
            helper.push(cells[cellFinder.get(`${this.x},${this.y - 1}`)]);
        }
        if (this.y < gridHeight - 1) {
            helper.push(cells[cellFinder.get(`${this.x},${this.y + 1}`)]);
        }
        return helper;
    }
}