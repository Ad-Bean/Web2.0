const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const queryString = require("querystring");
const hostname = "127.0.0.1";
const port = 8000;
const dataPath = "./users/UserData.json";
const registerPage = "./public/SignUp.html";
const searchPage = "./public/searchUser.html";
const userPage = "./public/user.html";
const JSpath = "./public";

// function for finding the duplicate user or finding the user by username
function findData(req, res) {
  fs.readFile(dataPath, "utf-8", (err, data) => {
    if (err) {
      console.log("ERROR: ", err);
      return res(false);
    }
    let users = JSON.parse(data);
    for (let user of users) {
      if (
        user.username == req.username ||
        user.phone == req.phone ||
        user.email == req.email ||
        user.studentID == req.studentID
      ) {
        // if it's duplicate or existing, return the user's information
        return res(user);
      }
    }
    // there're no duplicate users, return false
    return res(false);
  });
}

const server = http.createServer((req, res) => {
  const route = req.url;
  const content = queryString.parse(url.parse(route).query);
  let extName = path.extname(route).substring(1);
  if (route == "/") {
    // show the register page
    fs.readFile(registerPage, "utf-8", (err, html) => {
      if (err) {
        console.log("ERROR: ", err);
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
  } else if (route.startsWith("/users")) {
    // check if user is whether duplicate
    findData(content, (ret) => {
      if (!ret) {
        res.end("false"); // not duplicate
      } else {
        res.end("true"); // duplicate
      }
    });
  } else if (route.startsWith("/searchUser")) {
    // show the search page
    fs.readFile(searchPage, "utf-8", (err, html) => {
      if (err) {
        console.log("ERROR: ", err);
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    });
  } else if (route.startsWith("/register")) {
    // register an user
    req.on("data", (chunk) => {
      chunk = queryString.parse(chunk.toString());
      // check if it's duplicate on the server side
      findData(chunk, (ret) => {
        if (!ret) {
          let user = {
            username: chunk.username,
            studentID: chunk.studentID,
            phone: chunk.phone,
            email: chunk.email,
          };
          if (user) {
            fs.readFile(dataPath, "utf-8", (err, data) => {
              if (err) {
                console.log("ERROR: ", err);
                return;
              }
              let userData = JSON.parse(data);
              userData.push(user);
              //  redirect to user information page after registering
              fs.writeFile(dataPath, JSON.stringify(userData), (err) => {
                if (err) {
                  console.log("ERROR: ", err);
                  return;
                }
                res.writeHead(302, {
                  location: `http://localhost:8000?username=${user.username}`,
                });
                res.end();
              });
            });
          }
        }
      });
    });
  } else if (route.startsWith("/?username")) {
    findData(content, (ret) => {
      if (ret === false) {
        fs.readFile(registerPage, "utf-8", (err, html) => {
          if (err) {
            console.log("ERROR: ", err);
            return;
          }
          res.writeHead(404, { location: "http://localhost:8000" });
          res.end();
        });
      } else {
        fs.readFile(userPage, "utf-8", (err, html) => {
          if (err) {
            console.log("ERROR: ", err);
            return;
          }
          html = html.replace("USERNAME", ret.username);
          html = html.replace("STUDENTID", ret.studentID);
          html = html.replace("PHONE", ret.phone);
          html = html.replace("EMAIL", ret.email);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(html);
        });
      }
    });
  } else if (route.startsWith("/find")) {
    // Sign in an user with username
    const params = url.parse(req.url, true).query;
    let user = {
      username: params.username,
      studentID: "",
      phone: "",
      email: "",
    };
    findData(user, (ret) => {
      if (ret) {
        fs.readFile(dataPath, "utf-8", (err, data) => {
          if (err) {
            console.log("ERROR: ", err);
            return;
          }
          res.writeHead(302, {
            location: `http://localhost:8000?username=${user.username}`,
          });
          res.end();
        });
      }
    });
  } else if (extName == "js") {
    // load the js file
    fs.readFile(JSpath + route, "utf-8", (err, js) => {
      if (err) {
        console.log("ERROR: ", err);
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(js);
    });
  } else {
    try {
      // load other elements like svg and png
      fs.readFile(`.${route}`, (err, data) => {
        if (extName == "png" || extName == "jpg") {
          extName = `image/${extName}`;
        } else if (extName == "svg") {
          extName = "image/svg+xml";
        } else if (extName == "ico") {
          extName = "image/x-icon";
        } else {
          extName = `text/${extName}`;
        }
        res.writeHead(200, { "Content-Type": extName });
        res.end(data);
      });
    } catch (err) {
      fs.readFile("registerPage", "utf-8", (err, html) => {
        if (err) {
          console.log("ERROR: ", err);
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`** Server running at http://localhost:${port}/ **`);
  console.log("\x1b[33m%s\x1b[0m", "Press Ctrl+C to stop the server");
});
