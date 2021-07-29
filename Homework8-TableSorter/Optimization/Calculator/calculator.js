($ || _)(function () {
  let flag = false;
  $(".mainContainer").attr("onselectstart", "return false");

  $(".operand").click(function (e) {
    if (flag) {
      $("#expression").val(() => { return e.target.innerHTML; });
      $("#result").val("");
      flag = false;
      return;
    }

    if ($("#result").val() === "Infinity" || $("#result").val() === "Syntax Error!" || $("#result").val() === "NaN") {
      return;
    } else if ($("#expression").val() == "0") {
      $("#expression").val(e.target.innerHTML);
    } else {
      $("#expression").val(function () { return this.value + e.target.innerHTML; });
    }
  });

  $(".operator").click((e) => {
    if (e.target.innerHTML == "C" || e.target.innerHTML == "" || e.target.innerHTML == "=" || e.target.className.indexOf("backspace") !== -1) {
      return;
    }

    if (flag === true && (e.target.innerHTML != "(" || e.target.innerHTML != ")")) {
      $("#expression").val(() => { return $("#result").val(); });
      flag = false;
    }

    if ($("#result").val() == "Infinity" || $("#result").val() == "Syntax Error!" || $("#result").val() == "NaN") {
      return;
    } else {
      $("#expression").val(function () { return this.value + e.target.innerHTML; });
    }
  });

  $(".equal").click(() => {
    if ($("#expression").val() && flag === false) {
      try {
        $("#result").val(() => { return parseFloat(eval($("#expression").val().replace("÷", "/").replace("×", "*")).toFixed(15)); });
        flag = true;
      } catch (e) {
        $("#expression").val("Press C to continue!");
        $("#result").val("Syntax Error!");
      }
    }

    if ($("#expression").val() == "0") {
      $("#result").val("0"); $("#expression").val("0");
    }

    if ($("#result").val() == "Infinity" || $("#result").val() == "-Infinity") {
      flag = false;
      $("#result").val("Infinity");
      $("#expression").val("Can't Divide by Zero!");
    }

    if ($("#result").val() == "NaN") {
      flag = false;
      $("#expression").val("Press C to continue!");
    }
  });

  $(".backspace").click(() => {
    if ($("#result").val() == "Infinity" || $("#result").val() == "Syntax Error!" || $("#result").val() == "NaN" || $("#expression").val() == "" || flag === true) {
      return 0;
    }

    $("#expression").val(function () {
      return this.value.substr(0, this.value.length - 1);
    });
  });

  $(".clear").click(() => {
    $("#expression").val("0");
    $("#result").val("");
  });
});
