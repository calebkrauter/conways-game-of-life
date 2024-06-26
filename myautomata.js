/**
 * @author Caleb Krauter
 * @version 1.0.0
 */
const scale = {
    gridSize: 50,
}

const cell = {
    alive: false,
    width: (50 - scale.gridSize) + 10,
    height: (50 - scale.gridSize) + 10,
}

const gridLayers = {
    gridBack: Array.from({ length: scale.gridSize }, () => Array.from({ length: scale.gridSize }, () => cell)),
    gridFront: Array.from({ length: scale.gridSize }, () => Array.from({ length: scale.gridSize }, () => cell)),
    gridWidth: scale.gridSize,
    gridHeight: scale.gridSize
}

class MyAutomata {

    constructor(game) {
        Object.assign(this, { game });
        MyAutomata.debug = false;
        MyAutomata.debugBox = document.getElementById("debug");
        MyAutomata.gridBox = document.getElementById("grid");
        MyAutomata.chaosBox = document.getElementById("chaoticMode");
        MyAutomata.sourSkittlesBox = document.getElementById("sourSkittlesMode");
        MyAutomata.speedSlider = document.getElementById("speed");
        MyAutomata.speedSlider.value = 15;
        MyAutomata.sourSkittlesMode = false;
        MyAutomata.sourSkittlesBox.checked = false;
        MyAutomata.gridBox.checked = true;
        MyAutomata.chaosBox.checked = false;
        MyAutomata.enableGrid = true;
        MyAutomata.chaoticMode = false;
        MyAutomata.debugBox.checked = false;
        this.colorCycleIterator = 0;
        this.R = 0;
        this.G = 0;
        this.B = 0;
        this.tick = 0;
        this.count = 0;
        this.countCycles = 0;
        this.count = 0;
        this.tick = 0;
        this.canvas = document.getElementById("gameWorld");
        this.speed = parseInt(document.getElementById("speed").value, 10);
        this.size = parseInt(document.getElementById("size").value, 10);
        this.sizeSlider = document.getElementById("size");
        this.sizeSlider.value = 50;
        scale.gridSize = 50;

        this.initGridBack();
        this.initGridFront();
        this.updateGridFront();
    }


    runPresetA() {
        gridLayers.gridBack[0][1].alive = true;
        gridLayers.gridBack[1][1].alive = true;
        gridLayers.gridBack[2][1].alive = true;
    }

    runPresetB() {
        gridLayers.gridBack[1][2].alive = true;
        gridLayers.gridBack[1][3].alive = true;
        gridLayers.gridBack[1][4].alive = true;
        gridLayers.gridBack[2][5].alive = true;
        gridLayers.gridBack[3][5].alive = true;
        gridLayers.gridBack[4][5].alive = true;
        gridLayers.gridBack[5][2].alive = true;
        gridLayers.gridBack[5][3].alive = true;
        gridLayers.gridBack[5][4].alive = true;
        gridLayers.gridBack[2][1].alive = true;
        gridLayers.gridBack[3][1].alive = true;
        gridLayers.gridBack[4][1].alive = true;
    }
    initGridFront() {
        for (let x = 1; x < scale.gridSize - 1; x++) {
            for (let y = 1; y < scale.gridSize - 1; y++) {
                gridLayers.gridFront[x][y] = { ...gridLayers.gridBack[x][y] };
                if (x == 0 || y == 0 || x == scale.gridSize - 1 || y == scale.gridSize - 1) {
                    gridLayers.gridFront[x][y].alive = false;
                }
            }
        }
        return gridLayers.gridFront;

    }
    updateGridFront() {
        this.nextItr = true;
        for (let x = 1; x < scale.gridSize - 1; x++) {
            for (let y = 1; y < scale.gridSize - 1; y++) {
                let suroundingAliveCells = this.snapshotOfNeighborhood(x, y);

                if (gridLayers.gridBack[x][y].alive && suroundingAliveCells < 2) {
                    gridLayers.gridFront[x][y].alive = false;
                } else if (gridLayers.gridBack[x][y].alive && suroundingAliveCells === 2) {
                    gridLayers.gridFront[x][y].alive = true;
                }
                else if (gridLayers.gridBack[x][y].alive && suroundingAliveCells === 3) {
                    gridLayers.gridFront[x][y].alive = true;
                }
                else if (gridLayers.gridBack[x][y].alive && suroundingAliveCells > 3) {
                    gridLayers.gridFront[x][y].alive = false;
                }
                else if (gridLayers.gridBack[x][y].alive === false && suroundingAliveCells === 3) {
                    gridLayers.gridFront[x][y].alive = true;
                }
            }
        }
        gridLayers.gridBack = structuredClone(gridLayers.gridFront);
        return gridLayers.gridFront;

    }

    snapshotOfNeighborhood(theX, theY) {
        let aliveCellsCount = 0;
        if (gridLayers.gridBack[theX - 1][theY - 1].alive) {
            aliveCellsCount++;
        }
        if (gridLayers.gridBack[theX][theY - 1].alive) {
            aliveCellsCount++;
        }
        if (gridLayers.gridBack[theX + 1][theY - 1].alive) {
            aliveCellsCount++;
        }
        if (gridLayers.gridBack[theX - 1][theY].alive) {
            aliveCellsCount++;
        }
        if (gridLayers.gridBack[theX + 1][theY].alive) {
            aliveCellsCount++;
        }
        if (gridLayers.gridBack[theX - 1][theY + 1].alive) {
            aliveCellsCount++;
        }
        if (gridLayers.gridBack[theX][theY + 1].alive) {
            aliveCellsCount++;
        }
        if (gridLayers.gridBack[theX + 1][theY + 1].alive) {
            aliveCellsCount++;
        }
        return aliveCellsCount;
    }

    initGridBack() {
        for (let x = 0; x < scale.gridSize; x++) {
            for (let y = 0; y < scale.gridSize; y++) {
                gridLayers.gridBack[x][y] = { ...cell };
                if (x == 0 || y == 0 || x == scale.gridSize - 1 || y == scale.gridSize - 1) {
                    gridLayers.gridBack[x][y].alive = false;
                }

            }
        }
        return gridLayers.gridBack;
    }

    testRandomLife() {

        for (let x = 0; x < scale.gridSize; x++) {
            for (let y = 0; y < scale.gridSize; y++) {
                let aliveChance = Math.random();
                if (aliveChance > 0.5) {
                    gridLayers.gridBack[x][y].alive = true;
                } else {
                    gridLayers.gridBack[x][y].alive = false;
                }
                if (x == 0 || y == 0 || x == scale.gridSize - 1 || y == scale.gridSize - 1) {
                    gridLayers.gridBack[x][y].alive = false;
                }

            }
        }
    }

    getNewGrid() {
        let newGridBack = Array.from({ length: scale.gridSize }, () => Array.from({ length: scale.gridSize }, () => cell));
        let newGridFront = Array.from({ length: scale.gridSize }, () => Array.from({ length: scale.gridSize }, () => cell));
        for (let x = 0; x < scale.gridSize; x++) {
            for (let y = 0; y < scale.gridSize; y++) {
                if (gridLayers.gridBack[x] === undefined || gridLayers.gridBack[x][y] === undefined) {
                    newGridBack[x][y] = { ...cell };
                    newGridFront[x][y] = { ...cell };
                } else {
                    newGridBack[x][y] = gridLayers.gridBack[x][y];
                    newGridFront[x][y] = gridLayers.gridFront[x][y];
                }
                if (x == 0 || y == 0 || x == scale.gridSize - 1 || y == scale.gridSize - 1) {
                    newGridBack[x][y].alive = false;
                }
                if (x == 0 || y == 0 || x == scale.gridSize - 1 || y == scale.gridSize - 1) {
                    newGridFront[x][y].alive = false;
                }
            }
        }
        gridLayers.gridBack = newGridBack;
        gridLayers.gridFront = newGridFront;
        return [newGridBack, newGridFront];
    }

    update() {
        this.listenToUserInput();
        this.speed = parseInt(document.getElementById("speed").value, 10);
        this.size = parseInt(document.getElementById("size").value, 10);
        scale.gridSize = this.size;

        document.getElementById("sizeLabel").textContent = "(" + scale.gridSize + "X" + scale.gridSize + ")";

        gridLayers.gridBack = this.getNewGrid()[0];
        gridLayers.gridFront = this.getNewGrid()[1];
        let i = scale.gridSize;
        MyAutomata.scaleOffset = 0;
        for (let x = 0; x < scale.gridSize; x++) {
            for (let y = 0; y < scale.gridSize; y++) {
                (gridLayers.gridFront[x][y]).width = (50 - scale.gridSize) + 10;
                (gridLayers.gridFront[x][y]).height = (50 - scale.gridSize) + 10;
                (gridLayers.gridBack[x][y]).width = (50 - scale.gridSize) + 10;
                (gridLayers.gridBack[x][y]).height = (50 - scale.gridSize) + 10;
            }

        }

        if (MyAutomata.clicked || MyAutomata.continue) {
            if ((this.count++ >= this.speed && this.speed != 120) || MyAutomata.clicked) {
                if (MyAutomata.startRandomLife) {
                    this.testRandomLife();
                    MyAutomata.startRandomLife = false;
                }
                if (MyAutomata.presetA) {
                    this.runPresetA();
                    MyAutomata.presetA = false;
                }
                if (MyAutomata.presetB) {
                    this.runPresetB();
                    MyAutomata.presetB = false;
                }
                this.count = 0;
                this.tick++;
                document.getElementById("ticks").textContent = "Ticks: " + this.tick;
                this.updateGridFront();

                if (MyAutomata.chaoticMode) {
                    this.randomColors();
                }
                this.colorCycleIterator++;
                this.cycleColors();
            }
            MyAutomata.clicked = false;

        } else {
            MyAutomata.clicked = false;
            MyAutomata.continue = false;
        }
    }
    listenToUserInput() {
        document.getElementById("myIterateButton").addEventListener("click", function () {
            MyAutomata.clicked = true;
            MyAutomata.continue = false;
        });
        document.getElementById("myContinueButton").addEventListener("click", function () {
            MyAutomata.continue = true;
        });
        document.getElementById("randomLifeButton").addEventListener("click", function () {
            MyAutomata.startRandomLife = true;

        })
        document.getElementById("presetA").addEventListener("click", function () {
            MyAutomata.presetA = true;
        });
        document.getElementById("presetB").addEventListener("click", function () {
            MyAutomata.presetB = true;
        });

        MyAutomata.debugBox.addEventListener("change", function () {
            MyAutomata.debug = MyAutomata.debugBox.checked ? true : false;

        })
        MyAutomata.gridBox.addEventListener("change", function () {
            MyAutomata.enableGrid = MyAutomata.gridBox.checked ? true : false;

        })
        MyAutomata.chaosBox.addEventListener("change", function () {
            MyAutomata.chaoticMode = MyAutomata.chaosBox.checked ? true : false;
        });
        MyAutomata.sourSkittlesBox.addEventListener("change", function () {
            MyAutomata.sourSkittlesMode = MyAutomata.sourSkittlesBox.checked ? true : false;
        })
    }
    randomColors() {
        this.R = Math.floor(Math.random() * 256);
        this.G = Math.floor(Math.random() * 256);
        this.B = Math.floor(Math.random() * 256);
        return `rgb(${this.R}, ${this.G}, ${this.B})`;
    }

    draw(ctx) {
        let ctx2 = ctx;

        for (let x = 0; x < scale.gridSize; x++) {
            for (let y = 0; y < scale.gridSize; y++) {

                if (MyAutomata.debug && gridLayers.gridBack[x][y].alive) {
                    // To use indvidual R G and B colors cycle
                    ctx2.fillStyle = "Yellow";
                    // To use random colors.
                    ctx2.fillRect(x * cell.width + 10, y * cell.width + 10, cell.width, cell.height);
                }
                if (gridLayers.gridFront[x][y].alive) {
                    // To use indvidual R G and B colors cycle
                    ctx.fillStyle = `rgb(${this.R}, ${this.G}, ${this.B})`;
                    if (MyAutomata.sourSkittlesMode) {
                        ctx.fillStyle = this.randomColors();
                    }
                    // To use random colors.
                    ctx.fillRect(x * cell.width + 5, y * cell.width + 5, cell.width, cell.height);
                }
                if (MyAutomata.enableGrid) {
                    this.drawGridOutline(ctx, x, y);
                }

            }
        }
    }


    cycleColors() {
        if (this.colorCycleIterator > 255) {
            this.colorCycleIterator = 0
            this.R = 0;
            this.G = 0;
            this.B = 0;
            this.countCycles++;
        }
        if (this.countCycles == 0) {
            this.R++;
        }
        if (this.countCycles == 1) {
            this.G++;
            this.R = 0;
        }
        if (this.countCycles == 2) {
            this.B++;
            this.G = 0;
        }
        if (this.countCycles == 3) {
            this.R++;
            this.G++;
            this.B = 0;
        }
        if (this.countCycles == 4) {
            this.R++;
            this.B++;
            this.G = 0;
        }
        if (this.countCycles == 5) {
            this.G++;
            this.B++;
            this.R = 0;
        }
        if (this.countCycles == 6) {
            this.R++;
            this.G++;
            this.B++;
        }
        if (this.countCycles > 2) {
            this.countCycles = 0;
        }
    }

    drawGridOutline(ctx, x, y) {

        ctx.strokeStyle = "Black";
        ctx.lineWidth = 1;
        if (MyAutomata.debug) {

            ctx.fillStyle = "Blue"
            ctx.font = "25px Arial"
            ctx.fillText("(" + x + ",", x * cell.width + 5, y * cell.width + 35);
            ctx.fillText("  " + y + ")", x * cell.width + 20, y * cell.width + 35);
        }

        ctx.strokeRect(x * cell.width + 5, y * cell.width + 5, cell.width, cell.height)
    }
}
