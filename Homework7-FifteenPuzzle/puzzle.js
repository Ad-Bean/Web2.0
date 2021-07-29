/* 
  Homework 7 - Fifteen Puzzle
  廖雨轩 18322043

  All the comments are below. 
*/
// set an array to store the urls of backgroundImage
let puzzleImgs = [
    "assets/panda.jpg",
    "assets/dog.jpg",
    "assets/cat.jpg",
    "assets/koala.jpg",
    "assets/parrot.jpg",
];
// set an array to store the order of puzzles, which also can judge whether win or not
let order = [];
let game = document.getElementsByClassName("game")[0];
// if the game is not on or the player has won the game, then can change the background image.
let changeButton = document.getElementsByClassName("change")[0];
let startButton = document.getElementsByClassName("start")[0];
let resetButton = document.getElementsByClassName("reset")[0];
let won = document.getElementsByClassName("won")[0];
let gameState = false;
let emptyPos = { x: 3, y: 3 };

// initialize the game, icluding clear the state and set the backgroundImage to the first image
function initialize() {
    let copyProtect = document.getElementsByClassName("protect");
    for (let btn of copyProtect) {
        btn.setAttribute("onselectstart", "return false");
    }

    won.textContent = "";
    startButton.innerHTML = "开始";
    for (let i = 0; i < 16; ++i) {
        order.push(i);
    }

    for (let x = 0; x < 4; ++x) {
        for (let y = 0; y < 4; ++y) {
            if (x === 3 && y === 3) {
                emptyPos = { x: x, y: y };
            } else {
                buildPuzzle(0, x, y, x, y);
            }
        }
    }
}

// reset the puzzles, including the coordinate attributes of every puzzle
function resetPuzzles(x, y, dx, dy) {
    for (let i = 0; i < game.children.length; ++i) {
        if (
            game.children[i].getAttribute("dx") == dx &&
            game.children[i].getAttribute("dy") == dy
        ) {
            game.children[i].style.left = y * 100 + "px";
            game.children[i].style.top = x * 100 + "px";
            game.children[i].setAttribute("x", x);
            game.children[i].setAttribute("y", y);
        }
    }
}

function resetState() {
    won.textContent = "";
    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            resetPuzzles(x, y, x, y);
        }
    }
}

function buildPuzzle(curImg, x, y, dx, dy) {
    let piece = document.createElement("div");
    piece.classList.add("pieces");
    // use left and top to let the picture show one part of the backgroundImage
    piece.style.backgroundImage = "url(" + puzzleImgs[curImg] + ")";
    piece.style.left = dy * -100 + "px";
    piece.style.top = dx * -100 + "px";

    let puz = document.createElement("div");
    puz.classList.add("puzzles");
    puz.style.left = y * 100 + "px";
    puz.style.top = x * 100 + "px";
    // set attributes to store the current coordinate, and correct coordinate
    puz.setAttribute("x", x);
    puz.setAttribute("y", y);
    puz.setAttribute("dx", dx);
    puz.setAttribute("dy", dy);

    puz.appendChild(piece);
    game.appendChild(puz);

    // when you click the puzzle, check if it can move or not
    puz.addEventListener("click", () => {
        if (gameState) {
            let locaX = parseInt(puz.getAttribute("x")),
                locaY = parseInt(puz.getAttribute("y"));
            let emptyX = emptyPos.x,
                emptyY = emptyPos.y;
            // only one coordinate can be changed
            if (Math.abs(emptyX - locaX) + Math.abs(emptyY - locaY) !== 1) {
                return;
            }
            puz.setAttribute("x", emptyX);
            puz.setAttribute("y", emptyY);
            puz.style.left = emptyY * 100 + "px";
            puz.style.top = emptyX * 100 + "px";

            emptyPos = { x: locaX, y: locaY };
            let locaIndex = locaX * 4 + locaY;
            let emptyIndex = emptyX * 4 + emptyY;

            // swap the empty position with the current puzzle
            [order[locaIndex], order[emptyIndex]] = [
                order[emptyIndex],
                order[locaIndex],
            ];

            // to check if the order is correct
            let isOrdered = true;
            for (let i = 0; i < order.length; i++) {
                if (order[i] !== i) {
                    isOrdered = false;
                    break;
                }
            }

            if (isOrdered) {
                gameState = false;
                won.textContent = "You Win!";
                startButton.innerHTML = "开始";
                changeButton.style.backgroundColor = "";
                changeButton.classList.remove("noneActive");
            }
        }
    });
}

// change a background image , if the game is not on
changeButton.addEventListener("click", () => {
    if (!gameState) {
        won.textContent = "";
        let p = document.getElementsByClassName("pieces");
        let curImg = p[0].style.backgroundImage.slice(5, -2);
        let curIndex = puzzleImgs.indexOf(curImg);
        let nextImg = (curIndex + 1) % puzzleImgs.length;
        for (let i of p) {
            i.style.backgroundImage = "url(" + puzzleImgs[nextImg] + ")";
        }
        resetState();
    }
});

resetButton.addEventListener("click", () => {
    if (gameState) {
        startButton.innerHTML = "开始";
        changeButton.classList.remove("noneActive");
        changeButton.style.backgroundColor = "";
        gameState = !gameState;
        resetState();
    }
});

// return an adjacent puzzle's coordinate
function adjacentPuzzle(empX, empY, dim) {
    if (dim === 0) {
        return { x: empX - 1, y: empY };
    } else if (dim === 1) {
        return { x: empX, y: empY + 1 };
    } else if (dim === 2) {
        return { x: empX + 1, y: empY };
    } else if (dim === 3) {
        return { x: empX, y: empY - 1 };
    }
}

// shuffle the puzzles 
function shuffle() {
    let map = [];
    for (let i = 0; i < 4 * 4; ++i) {
        map.push(i);
    }
    emptyPos = { x: 3, y: 3 };

    for (let i = 0; i < 1000; ++i) {
        let empX = emptyPos.x,
            empY = emptyPos.y;
        const dim = Math.floor(Math.random() * 4);

        let adj = adjacentPuzzle(empX, empY, dim);

        if (adj.x < 0 || adj.x >= 4 || adj.y < 0 || adj.y >= 4) {
            adj = adjacentPuzzle(empX, empY, dim ^ 2);
        }

        const emptyIndex = empX * 4 + empY;
        const adjIndex = adj.x * 4 + adj.y;

        [map[emptyIndex], map[adjIndex]] = [map[adjIndex], map[emptyIndex]];

        emptyPos = adj;
    }

    order = map;

    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
            if (x != emptyPos.x || y != emptyPos.y) {
                let index = x * 4 + y;
                resetPuzzles(x, y, Math.floor(map[index] / 4), map[index] % 4);
            }
        }
    }
}

startButton.addEventListener("click", () => {
    won.textContent = "";
    gameState = true;
    startButton.innerHTML = "洗牌";
    // turn the change button 's color to grey, which means that it cant change the background
    changeButton.style.backgroundColor = "#343435";
    // 
    changeButton.classList.add("noneActive");
    shuffle();


    // get inversions to make sure the puzzle can be ordered
    let count = 0;
    for (let i = 0; i < order.length; i++) {

        for (let j = i; j < order.length; j++) {
            if (order[i] > order[j]) {
                count++;
            }
        }
    }
    // in fact, the shuffle method is guaranteed that the puzzle can be restored
    // which means that the inversion is always even
    while (count & 1)
        shuffle();
});

initialize();


