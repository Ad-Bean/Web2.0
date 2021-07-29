// Homework 4 - Simple Calculator
// 廖雨轩 18322043
// All the comments are below.

// use let instead of var to avoid variable promotion, which is from ES6
// use try catch to handle exceptions like syntax err or inf, not complex conditions like if (!isNaN(num)) {} else {}

// set a flag that can change the expression when inputing another operator or operand
let flag = false;

// I used div instead of button, which can be styled easily with grid and box-shadow
// add onselectstart attribute to avoid selecting the text inside the div
document.getElementsByClassName("mainContainer")[0].setAttribute("onselectstart", "return false");

// clear the expression and result
function clearError() {
  document.getElementById("expression").value = "0";
  document.getElementById("result").value = "";
}

// backspace
function backspace() {
  let exp = document.getElementById("expression");
  let res = document.getElementById("result");
  if (res.value === "Infinity" || res.value === "Syntax Error!") {
    return;
  } else {
    let sub = exp.value.substring(0, exp.value.length - 1);
    exp.value = sub;
  }
}

// add an operand to the expression
function operand(num) {
  let exp = document.getElementById("expression");
  let res = document.getElementById("result");
  if (flag === true) {
    exp.value = res.value;
    flag = false;
  }

  if (res.value === "Infinity" || res.value === "Syntax Error!") {
    return;
  } else if (exp.value == "0") {
    exp.value = num;
  } else {
    exp.value += num;
  }
}

// add an operator to the expression
function operator(op) {
  let exp = document.getElementById("expression");
  let res = document.getElementById("result");
  if (flag === true && (op != "(" || op != ")")) {
    exp.value = res.value;
    flag = false;
  }

  if (res.value == "Infinity" || res.value == "Syntax Error!") {
    return;
  } else {
    exp.value += op;
  }
}

// add zero to the expression
function zero() {
  let exp = document.getElementById("expression");
  let res = document.getElementById("result");
  if (res.value == "Infinity" || res.value == "Syntax Error!") {
    return;
  } else {
    exp.value += "0";
  }
}

// get the result of the expression
function getResult() {
  let exp = document.getElementById("expression");
  let res = document.getElementById("result");

  if (res.value === "Infinity" || res.value === "Syntax Error!") {
    return;
  }

  // if expression is not empty then try to evaluate it, catch error and handle exceptions
  if (exp.value) {
    try {
      res.value = eval(exp.value);
      flag = true;
    } catch (e) {
      alert("Syntax Error!");
      document.getElementById("expression").value = "Press C to continue!";
      document.getElementById("result").value = "Syntax Error!";
    }
  }
  if (exp.value == 0) {
    exp.value = "0";
    res.value = "0";
  }
  if (exp.value === "Infinity") {
    exp.value = "Can't divide by Zero!";
    res.value = "Infinity";
    alert("Can't divide by Zero!");
  }
}
