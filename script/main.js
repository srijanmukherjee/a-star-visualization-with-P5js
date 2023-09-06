const cols = 150;
const rows = 150;
const grid = new Array(cols);

let w;
let h;

// A* parameters
const OPEN = new Heap((a, b) => a.f < b.f);
const CLOSED = new Set();
const SEEN = new Set();
let start;
let end;
let path = [];
let bestDist = Infinity;
let noSolution = false;

// settings/info
let startStopBtn;
let p;

let running = false;
let done = false;

function setup() {
    const dim = min(windowHeight, windowWidth)
    createCanvas(dim, dim);

    w = width / cols;
    h = height / rows;

    generate();

    startStopBtn = createButton("Start");
    let resetBtn = createButton("Reset"); 
    p = createP();

    startStopBtn.elt.addEventListener("click", () => {
        if (running) {
            running = false;
            startStopBtn.elt.innerText = "Start";
        } else {
            running = true;
            startStopBtn.elt.innerText = "Stop";
        }
    });

    resetBtn.elt.addEventListener("click", () => {
        running = false;
        done = false;
        startStopBtn.elt.innerText = "Start";
        OPEN.arr = [null];
        OPEN.n = 0;
        SEEN.clear();
        CLOSED.clear();
        background(255)
        generate();
    })
    
}

function generate() {
    for (let i = 0; i < cols; i++)
        grid[i] = new Array(rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
            grid[i][j].addNeighbors(grid);


    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    start.isObstacle = false;
    end.isObstacle = false;

    // precompute the heuristics
    for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
            grid[i][j].h = heuristic(grid[i][j], end);

    for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
            grid[i][j].show(color(255));

    OPEN.insert(start);
    SEEN.add(start);
}

function draw() {
    if (!running) return;

    let current;
    if (OPEN.n > 0) {
        current = OPEN.delete();
        SEEN.delete(current);
        CLOSED.add(current);

        if (current === end) {
            console.log("Done");
            SEEN.clear();
            OPEN.arr = [null];
            OPEN.n = 0;
            CLOSED.clear();
            noLoop();
        } else {
            for (const neighbor of current.neighbors) {
                if (CLOSED.has(neighbor) || neighbor.isObstacle)
                    continue
    
                const tentative_gScore = current.g + 1;
                let newPath = false;

                if (SEEN.has(neighbor)) {
                    if (tentative_gScore < neighbor.g) {
                        neighbor.g = tentative_gScore;
                        neighbor.f = neighbor.g + neighbor.h;
                        OPEN.heapify();
                        newPath = true;
                    }
                } else {
                    neighbor.g = tentative_gScore;
                    newPath = true;
                    OPEN.insert(neighbor);
                    SEEN.add(neighbor)
                }
                
                neighbor.f = neighbor.g + neighbor.h;
                if (newPath) 
                    neighbor.cameFrom = current;

            }
        }
    } else {
        noSolution = true;
        console.log("No solution");
        noLoop();
    }

    if (current != end) {
        background(255);
        for (let i = 0; i < cols; i++)
            for (let j = 0; j < rows; j++)
                grid[i][j].show(color(255));
            
        for (const spot of SEEN)
            spot.show(color(64, 229, 90))

        for (const spot of CLOSED)
            spot.show(color(255, 72, 72));
    }


    // draw path
    if (current) {
        let ptr = current;
        push()
        noFill();
        beginShape();
        stroke(color(72, 161, 255))
        strokeWeight(4);
        curveVertex(ptr.x * w + w * 0.5, ptr.y * h + h * .5);
        while (ptr) {
            curveVertex(ptr.x * w + w * 0.5, ptr.y * h + h * .5);
            if (ptr.cameFrom == undefined)
                curveVertex(ptr.x * w + w * 0.5, ptr.y * h + h * .5);
            prev = ptr;
            ptr = ptr.cameFrom;
        }
        endShape();
        pop()
    }

    // draw end point
    if (current == end) {
        push();
            ellipseMode(CENTER);
            fill(255, 0, 0);
        circle(end.x * w + w / 2, end.y * h + h / 2, w);
        pop();
    }

    p.elt.innerHTML = `
    spots: ${rows * cols}<br>
    open: ${OPEN.n}<br>
    closed: ${CLOSED.size}<br>
    heuristic fn: euclidian<br>
    current g = ${current ? current.g : 'NA'}<br>
    status: ${noSolution ? 'No solution' : (end == current ? 'Path found' : 'possible')}`
}

function heuristic(a, b) {
    // return pow(abs(a.x - b.x) + abs(a.y - b.y), 2);
    return 2 * dist(a.x, a.y, b.x, b.y)
}