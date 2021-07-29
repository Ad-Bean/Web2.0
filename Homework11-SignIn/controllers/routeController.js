const {
  register,
  login,
  logout,
  getUserData,
} = require("../service/userService");
const { authorized, isLogin } = require("../middleware/authorized");
const { validateUser } = require("../service/validationService");

class RouteController {
  req = null;
  res = null;

  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async signUpPOST() {
    if (isLogin(this.req)) {
      await logout(this.req, this.res);
    }

    const {
      username,
      password,
      repeatPassword,
      number,
      phone,
      email,
    } = this.req.body;

    const validationResult = validateUser(
      { username, password, number, phone, email, repeatPassword },
      ["username", "password", "number", "phone", "email", "repeatPassword"]
    );

    if (password !== repeatPassword)
      validationResult.push({
        field: "repeatPassword",
        message: "密码与重复密码不一致",
      });

    if (validationResult.length > 0) {
      const model = {
        username,
        number,
        phone,
        email,
        signupSuccessClass: "in-valid",
      };

      for (const r of validationResult) {
        model[r.field + "ErrorClass"] = "in-valid";
        model[r.field + "Error"] = r.message;
      }

      this.res.render("signup", model);
      return;
    }

    const result = await register(this.req, this.res, username, password, {
      number,
      phone,
      email,
    });

    if (result) {
      const model = {
        username,
        number,
        phone,
        email,
        signupSuccessClass: "in-valid",
      };

      switch (result) {
        case "username":
          model.usernameError = "该用户名已被注册";
          model.usernameErrorClass = "in-valid";
          break;
        case "number":
          model.numberError = "该学号已被注册";
          model.numberErrorClass = "in-valid";
          break;
        case "phone":
          model.phoneError = "该电话已被注册";
          model.phoneErrorClass = "in-valid";
          break;
        case "email":
          model.emailError = "该邮箱已被注册";
          model.emailErrorClass = "in-valid";
          break;
      }
      this.res.render("signup", model);
      return;
    }

    this.res.redirect(`/?username=${username}`);
  }

  signUpGET() {
    if (isLogin(this.req)) {
      this.res.redirect("/");
    } else {
      this.res.render("signup");
    }
  }

  async signInGET() {
    if (!!this.req.query.username) {
      await this.userInfo(this.req.query.username);
      return;
    }

    if (isLogin(this.req)) {
      this.res.redirect(`/?username=${this.req.user.username}`);
    } else {
      this.res.render("signin");
    }
  }

  async signInPOST() {
    if (isLogin(this.req)) {
      await logout(this.req, this.res);
    }

    const { username, password } = this.req.body;

    const validationResult = validateUser({ username, password }, [
      "username",
      "password",
    ]);

    if (validationResult.length > 0) {
      const model = { username, signupSuccessClass: "in-valid" };
      for (const r of validationResult) {
        model[r.field + "ErrorClass"] = "in-valid";
        model[r.field + "Error"] = r.message;
      }
      this.res.render("signin", model);
      return;
    }

    const data = await login(this.req, this.res, username, password);

    if (data === 2) {
      this.res.redirect(`/?username=${username}`);
    } else {
      const model = { username, signupSuccessClass: "in-valid" };
      if (data === 0) {
        model.usernameErrorClass = "in-valid";
        model.usernameError = "用户不存在";
      } else {
        model.passwordErrorClass = "in-valid";
        model.passwordError = "密码错误";
      }
      this.res.render("signin", model);
    }
  }

  async userInfo(username) {
    const token = isLogin(this.req);
    if (!token) {
      this.res.redirect("/");
    } else if (this.req.user.username !== username) {
      let data = await getUserData(this.req, token);
      data["username"] = this.req.user.username;
      this.res.render("error", data);
    } else {
      const data = await getUserData(this.req, token);
      data.username = this.req.user.username;
      this.res.render("user", data);
    }
  }

  async signout() {
    await logout(this.req, this.res);
    this.res.redirect("/");
  }
}

module.exports = { RouteController };
