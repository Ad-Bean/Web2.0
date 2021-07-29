const { RouteController } = require("../controllers/routeController");

const routes = [
  {
    path: "/regist",
    method: "GET",
    controller: RouteController,
    action: "signUpGET",
  },
  {
    path: "/regist",
    method: "POST",
    controller: RouteController,
    action: "signUpPOST",
  },
  {
    path: "/",
    method: "GET",
    controller: RouteController,
    action: "signInGET",
  },
  {
    path: "/",
    method: "POST",
    controller: RouteController,
    action: "signInPOST",
  },
  {
    path: "/signout",
    method: "POST",
    controller: RouteController,
    action: "signout",
  },
];

module.exports = { routes };
