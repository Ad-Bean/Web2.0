/* 
  Homework 6-1 - The Amazing Mouse Maze
  廖雨轩 18322043
*/
window.onload = function () {
    // properties
    let maze = document.getElementsByClassName("mazeContainer")[0];
    let walls = document.getElementsByClassName("wall");
    let result = document.getElementsByClassName("headerResult")[0];
    let start = document.getElementsByClassName("startPoint")[0];
    let end = document.getElementsByClassName("endPoint")[0];

    // flags that store the condition
    let startCheck = false;
    let cheatCheck = true;

    function reset() {
        startCheck = false;
        cheatCheck = true;
        // use an iterator to reset walls
        Array.from(walls).forEach((wall) => {
            wall.classList.remove("collision");
        });
        result.classList.remove("getResult");
    }

    // when u hover on the start block the game starts
    // use arrow function to make it looks more clean
    start.addEventListener("mouseover", () => {
        reset();
        startCheck = true;
        cheatCheck = false;
    });

    // if u leaves out of mazeContainer, then it's cheating
    maze.addEventListener("mouseleave", () => {
        // in rest, cheatCheck is set to true
        reset();
    });

    // when u hover on the end block the game ends, and give u the result
    end.addEventListener("mouseover", () => {
        // 2 cheating conditions: without starting from S, then it's cheating, and starting from S but ending in E from outside.
        getResult();
        startCheck = false;
    });

    // judging by the flag (cheat-check and start-check), it'll show the result by giving an animation
    function getResult() {
        if (cheatCheck === true) {
            result.textContent =
                "Don't cheat, you should start from the 'S' and move to the 'E' inmap the maze!";
        } else if (startCheck === true) {
            result.textContent = "You Win!";
        } else {
            result.textContent = "You Lose!";
        }
        result.classList.add("getResult");
    }

    // use an iterator to judge collision
    Array.from(walls).forEach((wall) => {
        wall.addEventListener("mouseover", (event) => {
            if (startCheck === true) {
                event.target.classList.add("collision");
                startCheck = false;
                cheatCheck = false;
                getResult();
            }
        });
    });
};
