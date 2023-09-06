const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
// const dirs = [[-1, 0], [0, -1], [0, 1], [1, 0]]; // no diagonals

class Spot {
    constructor(x, y) {
        // f = g + h
        this.x = x;
        this.y = y;
        this.f = Infinity;
        this.g = 0;
        this.h = 0;
        this.cameFrom = undefined;
        this.neighbors = [];
        this.isObstacle = random() * random() < .05;
    }

    show(color) {
        fill(color);
        if (this.isObstacle)
            fill(0)
        noStroke()
        // if (this.isObstacle) {
            ellipseMode(CENTER);
            ellipse(w * this.x + w/2, h * this.y + h / 2, w / 2, h / 2);
        // }
        // else
        //     rect(w * this.x, h * this.y, w, h);
    }

    addNeighbors(grid) {
        for (const [dx, dy] of dirs) {
            const i = this.x + dx;
            const j = this.y + dy;

            if (i >= 0 && j >= 0 && i < cols && j < rows)
                this.neighbors.push(grid[i][j]);
        }
    }
}