function authorized(req, res, next) {
  try {
    const { username, token } = JSON.parse(req.cookies.user);
    req.user = !!username
      ? {
          username,
          token,
        }
      : undefined;
  } catch {
    req.user = undefined;
    res.clearCookie("user");
  }
  next();
}

function isLogin(req) {
  const user = req.user;
  if (typeof user === "undefined") {
    return null;
  }

  if (req.session[user.token] && req.session[user.token] === user.username) {
    return user.token;
  }

  return null;
}

module.exports = { authorized, isLogin };
