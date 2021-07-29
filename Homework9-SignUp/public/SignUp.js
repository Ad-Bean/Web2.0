$(function () {
  // 用户名6~18位英文字母、数字或下划线，必须以英文字母开头
  const usernamePattern = /^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/;
  // 学号8位数字，不能以0开头
  const studentIDPattern = /^[1-9][0-9]{7}$/;
  // 电话11位数字，不能以0开头
  const phonePattern = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
  // 邮箱验证，以@分隔
  const emailPattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

  let isDuplicate = false;

  function showInfo(text, id) {
    $(".mainContainer").addClass("taller");
    $(".info").show();
    $(".info").text(text);
    $("." + id + "check").hide();
    $("." + id + "false").show();
  }

  function removeInfo(id) {
    $(".info").text("");
    $(".mainContainer").removeClass("taller");
    $(".info").hide();
    $("." + id + "false").hide();
    $("." + id + "check").show();
  }

  function resetAll() {
    $(".usernamecheck").hide();
    $(".studentIDcheck").hide();
    $(".phonecheck").hide();
    $(".emailcheck").hide();
    $(".usernamefalse").hide();
    $(".studentIDfalse").hide();
    $(".phonefalse").hide();
    $(".emailfalse").hide();
  }

  function finalCheck() {
    let vals = new Array();
    for (let id of $("input")) {
      let tmp = $(id).attr("id");
      if (tmp) vals.push(`#${tmp}`);
    }
    return (
      usernamePattern.test($(vals[0]).val()) &&
      studentIDPattern.test($(vals[1]).val()) &&
      phonePattern.test($(vals[2]).val()) &&
      emailPattern.test($(vals[3]).val())
    );
  }

  function checkInput(e) {
    let val = $(e.target).val();
    let inputID = $(e.target).attr("id");
    switch (inputID) {
      case "username":
        let nameCheck = usernamePattern.test(val);
        const numPattern = /^\d+[\w\W]*$/;
        if (numPattern.test(val)) {
          showInfo("用户名必须以英文字母开头", inputID);
          break;
        }
        if (val.length < 6 || val.length > 18) {
          showInfo("用户名长度必须为 6-18 位", inputID);
          break;
        }
        if (nameCheck) {
          $.get("http://localhost:8000/users", { [inputID]: val }, (data) => {
            if (data == "true") {
              showInfo("用户名重复", inputID);
              isDuplicate = true;
            } else {
              removeInfo(inputID);
              isDuplicate = false;
            }
          });
          break;
        } else {
          showInfo("用户名包含英文字母、数字或下划线", inputID);
          break;
        }
      case "studentID":
        if (val[0] == "0") {
          showInfo("学号不能以 0 开头", inputID);
          break;
        }
        if (val.length != 8) {
          showInfo("学号必须为 8 位数字", inputID);
          break;
        }
        let IDCheck = studentIDPattern.test(val);
        if (IDCheck) {
          $.get("http://localhost:8000/users", { [inputID]: val }, (data) => {
            if (data == "true") {
              showInfo("学号重复", inputID);
              isDuplicate = true;
            } else {
              removeInfo(inputID);
              isDuplicate = false;
            }
          });
          break;
        } else {
          showInfo("学号必须为 8 位数字", inputID);
          break;
        }
      case "phone":
        if (val[0] == "0") {
          showInfo("手机号不能以 0 开头", inputID);
          break;
        }
        let phoneCheck = phonePattern.test(val);
        if (phoneCheck) {
          $.get("http://localhost:8000/users", { [inputID]: val }, (data) => {
            if (data == "true") {
              showInfo("手机号重复", inputID);
              isDuplicate = true;
            } else {
              removeInfo(inputID);
              isDuplicate = false;
            }
          });
          break;
        } else if (val.length != 11) {
          showInfo("手机号码为 11 位数字", inputID);
          break;
        } else {
          showInfo("请输入正确的手机号码", inputID);
          break;
        }
      case "email":
        let mailCheck = emailPattern.test(val);
        if (mailCheck) {
          $.get("http://localhost:8000/users", { [inputID]: val }, (data) => {
            if (data == "true") {
              showInfo("邮箱重复", inputID);
              isDuplicate = true;
            } else {
              removeInfo(inputID);
              isDuplicate = false;
            }
          });
          break;
        } else {
          showInfo("请输入邮箱地址", inputID);
          break;
        }
      default:
        break;
    }
  }

  $("input").blur(function (e) {
    checkInput(e);
  });

  $(".reset").click(resetAll);

  $(".register").click(function (event) {
    if (!finalCheck() || isDuplicate) {
      event.preventDefault();
      showInfo("请检查用户信息是否填写正确");
    }
  });
});
