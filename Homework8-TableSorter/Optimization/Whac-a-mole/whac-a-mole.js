($ || _)(function () {
    let state = false;
    let mole = null;
    let countdown = null;

    (function creatButton() {
        for (let i = 0; i < 60; i++) {
            $(".gameContainer").append('<input class="dirts" type="radio" name="dirts">');
        }
    })();

    $(".gameButton").click(function () {
        if (!state) {
            state = !state;
            $("#score").val("0");
            $("#time").val("30");
            $("#condition").val("Playing");
            countdown = setInterval(function () {
                $("#time").val(() => { return parseFloat($("#time").val()) - 1; });
                if ($("#time").val() == "0") {
                    state = !state;
                    countdown = window.clearInterval(countdown);
                    mole.checked = false;
                    $("#condition").val("Game Over");
                }
            }, 1000);
            generateMole();
        } else {
            state = !state;
            countdown = window.clearInterval(countdown);
            mole.checked = false;
        }
    });

    function generateMole() {
        mole = $(".dirts")[_.random($(".dirts").length - 1)];
        while (mole.checked == true) {
            mole = $(".dirts")[_.random($(".dirts").length - 1)];
        }
        mole.checked = true;
    }

    $(".dirts").click(function () {
        if (state && $("#time").val() != "0") {
            if ($(this)[0] == mole) {
                $("#score").val(function () {
                    return parseInt(this.value) + 1;
                });
                $(this)[0].checked = false;
                generateMole();
            } else {
                $("#score").val(function () {
                    return parseInt(this.value) - 1;
                });
                mole.checked = true;
            }
        } else {
            $(this)[0].checked = false;
        }
    });
});