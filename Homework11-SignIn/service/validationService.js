const validations = require("../controllers/errorController");

function validateUser(data, forceFields) {
  const err = [];

  for (const validator of validations) {
    if (data[validator.field]) {
      if (!validator.validator(data[validator.field])) {
        err.push({
          field: validator.field,
          message: validator.message,
        });
      }
    }
  }

  for (const field of forceFields) {
    if (!data[field]) {
      err.push({
        field,
        message: "此项不能为空",
      });
    }
  }
  return err;
}

module.exports = { validateUser };
