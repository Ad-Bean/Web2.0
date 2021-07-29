$(function () {
  // store the index to make sure when mouse leave, the number wont be seen again
  let index = 0;

  (function () {
    $(".button").css("cursor", "default");
    $(".apb").css("cursor", "pointer");
  })();

  // reset the style and attribute
  const reset = function () {
    $(".apb").css("cursor", "pointer");
    $("#info-bar").removeAttr("status");
    $("#control-ring .button")
      .removeAttr("value")
      .removeAttr("status");
    $("#control-ring").removeAttr("status");
    $(".sum").text("");
  };

  const getSum = function () {
    new Promise(() => {
      if (
        $("#info-bar").attr("status") !== "done" ||
        !$("#info-bar").attr("status")
      ) {
        return;
      }
      let res = $("#control-ring .button")
        .toArray()
        .map((x) => Number.parseInt($(x).attr("value")))
        .reduce((a, b) => a + b, 0);
      if (!isNaN(res)) {
        $(".sum").text(res);
        $("#info-bar").removeAttr("status");
      }
    });
  };

  const autoClick = (button, time) =>
    new Promise((resolve, reject) => {
      if (button.attr("value")) {
        return;
      }

      button.children(".unread").text("...");
      button.attr("value", "...").attr("status", "await");
      $("#control-ring").attr("status", "await");

      let name = button.attr("class").substr(0, 1);
      fetch("http://localhost:3000/" + name)
        .then((response) => response.text())
        .then((random) => {
          if (time != index) {
            return;
          }
          button.children(".unread").text(random);
          button.attr("value", random).attr("status", "done")
          $("#control-ring").attr("status", "done");
          if (
            $("#control-ring .button")
              .toArray()
              .filter(
                (x) => $(x).attr("value") === "..." || !$(x).attr("value")
              ).length == 0
          ) {
            $("#info-bar").attr("status", "done");
          }
          resolve();
        })
        .catch((err) => reject(err));
    });

  $("#at-plus-container").mouseleave(() => {
    index++;
    reset();
  });

  $(".apb").click(function () {
    let current = index;
    $(".apb").css("cursor", "default");
    Promise.all(
      $("#control-ring .button")
        .toArray()
        .map((x) => autoClick($(x), current))
    ).then(() => getSum());
  });
});
