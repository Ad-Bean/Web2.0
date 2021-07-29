$(function () {
  // store the index to make sure when mouse leave, the number wont be seen again
  let index = 0;

  // reset the style
  (function () {
    $(".button").css("cursor", "default");
    $(".apb").css("cursor", "pointer");
    $(".sum").css("font-size", "16px");
  })();

  // reset the style and attribute
  const reset = function () {
    $(".sequence").fadeOut();
    $(".currentSum").text("");
    $("#info-bar").removeAttr("status");
    $(".apb").css("cursor", "pointer");
    $("#control-ring .button").removeAttr("value").removeAttr("status");
    $("#control-ring").removeAttr("status");
    $(".sum").text("");
  };

  const asyncClick = (button, current, reason) =>
    new Promise(function (resolve, reject) {
      if (
        button.attr("value") ||
        $("#control-ring").attr("status") === "await"
      ) {
        return;
      }

      button.children(".unread").text("...");
      button.attr("value", "...").attr("status", "await");
      $("#control-ring").attr("status", "await");

      fetch("http://localhost:3000/")
        .then((response) => response.text())
        .then((random) => {
          if (current != index) {
            return;
          }

          // there's some probability to fail
          if (Math.random() < 0.3) {
            button.removeAttr("value").removeAttr("status");
            $("#control-ring").removeAttr("status");
            reject(reason);
            return;
          }

          button.children(".unread").text(random);
          button.attr("value", random).attr("status", "done");
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

          resolve(random);
        })
        .catch((err) => reject(err));
    });

  // each handler
  aHandler = function (currentSum, thisTime, resolve, reject) {
    if (thisTime != index) {
      return;
    }
    $(".sum").text("这是个天大的秘密");

    asyncClick($("#control-ring .button:eq(0)"), thisTime, {
      message: "这不是个天大的秘密",
      currentSum,
    })
      .then((res) => resolve(currentSum + parseInt(res)))
      .catch((err) => reject(err));
  };

  bHandler = function (currentSum, thisTime, resolve, reject) {
    if (thisTime != index) {
      return;
    }
    $(".sum").text("我不知道");

    asyncClick($("#control-ring .button:eq(1)"), thisTime, {
      message: "我知道",
      currentSum,
    })
      .then((res) => resolve(currentSum + parseInt(res)))
      .catch((err) => reject(err));
  };

  cHandler = function (currentSum, thisTime, resolve, reject) {
    if (thisTime != index) {
      return;
    }
    $(".sum").text("你不知道");

    asyncClick($("#control-ring .button:eq(2)"), thisTime, {
      message: "你知道",
      currentSum,
    })
      .then((res) => resolve(currentSum + parseInt(res)))
      .catch((err) => reject(err));
  };

  dHandler = function (currentSum, thisTime, resolve, reject) {
    if (thisTime != index) {
      return;
    }
    $(".sum").text("他不知道");

    asyncClick($("#control-ring .button:eq(3)"), thisTime, {
      message: "他知道",
      currentSum,
    })
      .then((res) => resolve(currentSum + parseInt(res)))
      .catch((err) => reject(err));
  };

  eHandler = function (currentSum, thisTime, resolve, reject) {
    if (thisTime != index) {
      return;
    }
    $(".sum").text("才怪");

    asyncClick($("#control-ring .button:eq(4)"), thisTime, {
      message: "确实",
      currentSum,
    })
      .then((res) => resolve(currentSum + parseInt(res)))
      .catch((err) => reject(err));
  };

  bubbleHandler = function (currentSum, thisTime, resolve, reject) {
    if (thisTime != index) {
      return;
    }

    if (Math.random() < 0.5) {
      $(".sum").text("楼主异步调用战斗力感人，目测不超过" + currentSum);
    } else {
      reject({
        message: "楼主异步调用战斗力爆表，目测超过" + currentSum,
        currentSum,
      });
    }
  };

  $("#at-plus-container").mouseleave(() => {
    reset();
  });

  robot = function (callback, num, currentSum, thisTime) {
    if (num >= callback.length) {
      return;
    }

    callback[num](
      currentSum,
      thisTime,
      function (nextSum) {
        robot(callback, num + 1, nextSum, thisTime);
      },
      function (err) {
        if (thisTime != index) {
          return;
        }
        $(".sum").text(err.message);
        if (currentSum && err.message.indexOf("爆表") == -1)
          $(".currentSum").text(currentSum);
      }
    );
  };

  const showSequence = function (seq) {
    $(".sequence").hide();
    $(".sequence").text(
      seq.map((button) => String.fromCharCode(65 + button.i)).join("->")
    );
    $(".sequence").fadeIn();
  };

  $(".apb").click(function () {
    if ($("#control-ring").attr("status") === "await") {
      return;
    }
    reset();
    $(".apb").css("cursor", "default");

    let thisTime = ++index;

    let handlers = _.shuffle(
      [aHandler, bHandler, cHandler, dHandler, eHandler].map((action, i) => ({
        action,
        i,
      }))
    );
    showSequence(handlers);
    handlers.push({ action: bubbleHandler, i: handlers.length + 1 });

    robot(
      handlers.map(({ action }) => action),
      0,
      0,
      thisTime
    );
  });
});
