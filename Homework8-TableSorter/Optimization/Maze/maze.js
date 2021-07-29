($ || _)(function () {
    let startCheck = false;
    let cheatCheck = true;

    let reset = () => {
        startCheck = false;
        cheatCheck = true;
        _.forEach($(".wall"), function (wall) {
            $(wall).removeClass("collision");
        });
        $(".headerResult").removeClass("getResult");
    };

    let getResult = () => {
        if (cheatCheck) {
            $(".headerResult").text("Don't cheat, you should start from the 'S' and move to the 'E' inmap the maze!");
        } else if (startCheck) {
            $(".headerResult").text("You Win!");
        } else {
            $(".headerResult").text("You Lose!");
        }
        $(".headerResult").addClass("getResult");
    };

    $(".startPoint").mouseover(() => {
        reset();
        startCheck = true;
        cheatCheck = false;
    });

    $(".endPoint").mouseover(() => {
        if (startCheck) {
            getResult();
            startCheck = false;
        } else if (cheatCheck) {
            getResult();
        }
    });

    $(".wall").mouseover(function () {
        if (startCheck) {
            $(this).addClass("collision");
            startCheck = false;
            cheatCheck = false;
            getResult();
        }
    })

    $(".mazeContainer").mouseleave(() => { reset() })
});
