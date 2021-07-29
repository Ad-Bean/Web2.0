$(function () {
  // 用户名6~18位英文字母、数字或下划线，必须以英文字母开头
  const usernamePattern = /^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/;
  const numPattern = /^\d+[\w\W]*$/;

  let isExist = false;

  function showInfo(text) {
    $(".mainContainer").addClass("taller");
    $(".info").show();
    $(".info").text(text);
  }

  function removeInfo() {
    $(".info").text("");
    $(".mainContainer").removeClass("taller");
    $(".info").hide();
  }

  $("#username").blur(function (e) {
    let val = $(e.target).val();
    const nameCheck = usernamePattern.test(val);

    if (val.length == 0) {
      removeInfo();
      isExist = false;
      return;
    }

    if (val.length < 6 || val.length > 18) {
      showInfo("用户名长度必须为 6-18 位");
      isExist = false;
      return;
    }

    if (numPattern.test(val)) {
      showInfo("用户名必须以英文字母开头");
      isExist = false;
      return;
    }

    if (nameCheck) {
      $.get("http://localhost:8000/users", { ["username"]: val }, (data) => {
        if (data == "true") {
          isExist = true;
          removeInfo();
          return;
        } else {
          showInfo("用户不存在");
          isExist = false;
          return;
        }
      });
    } else {
      showInfo("用户名包含英文字母、数字或下划线");
      isExist = false;
      return;
    }
  });

  $(".signIn").click(function (event) {
    if (!isExist) {
      event.preventDefault();
      $("#username").val("");
      showInfo("用户名错误，请重试");
    }
  });
});
