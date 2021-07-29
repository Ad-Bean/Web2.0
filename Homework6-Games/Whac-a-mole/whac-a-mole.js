/*
 Homework 6-2 - Whac a mole
 廖雨轩 18322043
*/

// generate the mole
let mole = null;
// game's state that is playing or over
let state = false;
let goal = 0;
let score = document.getElementById("score");
let clock = 30;
let time = document.getElementById("time");
let gameContainer = document.getElementsByClassName("gameContainer")[0];
let gameStateButton = document.getElementsByClassName("gameButton")[0];
// dirts is an array of 6 * 10 radio buttons in the gameContainer
let dirts = document.getElementsByClassName("dirts");
// the counting down timer
let timer = null;

// since i used the async attribute in html, i didnt use window.onload = () => {}
creatButton();

// when u click the dirts, if it was mole and game was on then you would get goals. Otherwise, dock goals.
Array.from(dirts).forEach((dirt) => {
    dirt.addEventListener("click", (event) => {
        if (state === true) {
            if (clock !== 0) {
                if (event.target === mole) {
                    ++goal;
                    event.target.checked = false;
                    generateMole();
                } else {
                    --goal;
                    event.target.checked = false;
                    mole.checked = true;
                }
            }
            document.getElementById("score").value = goal;
        } else if (state === false) {
            event.target.checked = false;
        }
    });
});

// toggle the game state if u click the start|stop button
gameStateButton.addEventListener("click", () => {
    let condition = document.getElementById("condition");
    if (state === false) {
        state = !state;
        goal = 0;
        clock = 30;
        score.value = 0;
        time.value = 30;
        condition.value = "Playing";
        generateMole();
        countDown();
    } else if (state === true) {
        clearTimeout(timer);
        timer = null;
        state = !state;
        score.value = goal;
        condition.value = "Game Over";
        mole.checked = false;
    }
});

// generate a mole among the dirts randomly
function generateMole() {
    mole = dirts[Math.floor((dirts.length - 1) * Math.random())];
    // avoid generating the same mole
    while (mole.checked === true) {
        mole = dirts[Math.floor((dirts.length - 1) * Math.random())];
    }
    mole.checked = true;
}

// creat 6 * 10 dirts radio button in the gameContainer
function creatButton() {
    for (let i = 0; i < 60; i++) {
        let newButton = document.createElement("input");
        newButton.setAttribute("type", "radio");
        newButton.setAttribute("name", "dirts");
        newButton.className = "dirts";
        gameContainer.appendChild(newButton);
    }
}

// if the window lost focus, reset the game but store your score and timer
window.onblur = () => {
    clearTimeout(timer);
    timer = null;
    state = false;
    goal = 0;
    clock = 30;
    mole.checked = false;
    document.getElementById("condition").value = "Ready to Play";
};

// the timer which counts down from 30, ends when it's 0
function countDown() {
    timer = setTimeout(countDown, 1000);
    if (clock >= 0) {
        time.value = clock;
        clock--;
    } else {
        clearTimeout(timer);
        timer = null;
        clock = 0;
        time.value = 0;
        state = false;
        let condition = document.getElementById("condition");
        condition.value = "Game Over";
    }
}
