$(function () {
  // store the index to make sure when mouse leave, the number wont be seen again
  let index = 0;

  // reset the style and attribute
  const reset = function () {
    $("#info-bar").removeAttr("status");
    $("#control-ring .button")
      .removeAttr("value")
      .removeAttr("status");
    $("#control-ring").removeAttr("status");
    $(".sum").text("");
  };

  const getSum = function () {
    if ($("#info-bar").attr("status") !== "done" || !$("#info-bar").attr("status")) { return; }
    // use es5 reduce and map method
    let res = $("#control-ring .button")
      .toArray()
      .map((x) => Number.parseInt($(x).attr("value")))
      .reduce((a, b) => a + b, 0);
    if (!isNaN(res)) {
      $(".sum").text(res);
      $("#info-bar").removeAttr("status");
    }
  };

  $("#at-plus-container").mouseleave(() => {
    // move to next index
    index++;
    reset();
  });

  $("#control-ring .button").click(function (e) {
    let current = index;
    if ($(this).attr("value")) { return; }
    if ($("#control-ring").attr("status") === "await") { return; }

    $(this).children(".unread").text("...");
    $(this).attr("value", "...").attr("status", "await");
    $("#control-ring").attr("status", "await");
    fetch("http://localhost:3000/")
      .then((response) => response.text())
      .then((random) => {
        if (current !== index) { return; }
        $(this).children(".unread").text(random);
        $(this)
          .attr("value", random)
          .attr("status", "done")
        $("#control-ring").attr("status", "done");
        if (
          $("#control-ring .button")
            .toArray()
            .filter((x) => {
              if ($(x).attr("value") === "..." || !$(x).attr("value")) return x;
            }).length == 0
        ) {
          $("#info-bar").attr("status", "done");
        }
      })
      .catch((err) => console.log(err));
  });

  $("#info-bar").click(getSum);
});
