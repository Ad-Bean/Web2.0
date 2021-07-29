($ || _)(function () {
    let puzzleImgs = [
        "assets/panda.jpg",
        "assets/dog.jpg",
        "assets/cat.jpg",
        "assets/koala.jpg",
        "assets/parrot.jpg",
    ];
    let order = Array(16)
        .fill()
        .map((v, i) => i);
    let emptyPos = { x: 3, y: 3 };
    let gameState = false;

    (function () {
        $(".protect").attr("onselectstart", "return false");
        $(".won").text("");
        $(".start").text("开始");
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                if (x === 3 && y === 3) {
                    emptyPos = { x: x, y: y };
                } else {
                    buildPuzzle(0, x, y, x, y);
                }
            }
        }
    })();

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

    function shuffle() {
        let map = Array(16).fill().map((v, i) => i);
        emptyPos = { x: 3, y: 3 };

        for (let i = 0; i < 1000; ++i) {
            let empX = emptyPos.x,
                empY = emptyPos.y;
            const dim = _.random(3);

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

    function buildPuzzle(curImg, x, y, dx, dy) {
        let piece = $("<div></div>")
            .addClass("pieces")
            .css({
                "background-image": "url(" + puzzleImgs[curImg] + ")",
                left: `${dy * -100}px`,
                top: `${dx * -100}px`,
            });

        let puz = $("<div></div>")
            .addClass("puzzles")
            .css({
                left: `${y * 100}px`,
                top: `${x * 100}px`,
            })
            .attr({
                x: x,
                y: y,
                dx: dx,
                dy: dy,
            })
            .append(piece);

        $(".game").append(puz);

        $(puz).click(function () {
            if (gameState) {
                let locaX = parseInt($(this).attr("x")),
                    locaY = parseInt($(this).attr("y"));
                let emptyX = emptyPos.x,
                    emptyY = emptyPos.y;
                if (Math.abs(emptyX - locaX) + Math.abs(emptyY - locaY) !== 1) {
                    return;
                }
                $(this)
                    .attr({ x: emptyX, y: emptyY })
                    .css({
                        left: `${emptyY * 100}px`,
                        top: `${emptyX * 100}px`,
                    });
                emptyPos = { x: locaX, y: locaY };
                let locaIndex = locaX * 4 + locaY,
                    emptyIndex = emptyX * 4 + emptyY;

                [order[locaIndex], order[emptyIndex]] = [order[emptyIndex], order[locaIndex]];

                let isOrdered = _.isEqual(order, Array(16).fill().map((v, i) => i));

                if (isOrdered) {
                    gameState = false;
                    $(".won").text("You Win!");
                    $(".start").text("开始");
                    $(".change").removeClass("noneActive").css({ "background-color": "" });
                }
            }
        });
    }

    function resetState() {
        $(".won").text("");
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                resetPuzzles(x, y, x, y);
            }
        }
    }

    function resetPuzzles(x, y, dx, dy) {
        for (let i = 0; i < $(".game").children().length; ++i) {
            if ($(`.game .puzzles:eq(${i})`).attr("dx") == dx && $(`.game .puzzles:eq(${i})`).attr("dy") == dy) {
                $(`.game .puzzles:eq(${i})`)
                    .css({
                        left: `${y * 100}px`,
                        top: `${x * 100}px`,
                    })
                    .attr({
                        "x": x,
                        "y": y,
                    });
            }
        }
    }

    $(".change").click(() => {
        if (!gameState) {
            $(".won").text("");
            let index = $(".pieces").css("background-image").search("assets");
            let curImg = $(".pieces").css("background-image").slice(index, -2);
            let nextImg = (puzzleImgs.indexOf(curImg) + 1) % puzzleImgs.length;

            _.forEach($(".pieces"), function (e) {
                $(e).css({ "background-image": "url(" + puzzleImgs[nextImg] + ")" });
            });
            resetState();
        }
    });

    $(".start").click(() => {
        gameState = true;
        $(".won").text("");
        $(".start").text("洗牌");
        $(".change").addClass("noneActive").css({ "background-color": "#343435" });
        shuffle();
    });

    $(".reset").click(() => {
        if (gameState) {
            gameState = !gameState;
            $(".start").text("开始");
            $(".change").removeClass("noneActive").css({ "background-color": "" });
            resetState();
        }
    });
});
