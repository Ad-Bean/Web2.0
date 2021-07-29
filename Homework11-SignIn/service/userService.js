// Secure Hash Algorithm 2 to encode password
const { sha256 } = require("js-sha256");
const { getMongoDb } = require("./mongodbService");
// Create a version 1 (timestamp) UUID
const { v1: uuidv1 } = require("uuid");

function decodePassword(password) {
  const salt = "Liaoyuxuan Salt";
  return sha256(sha256(password + salt) + salt);
}

async function login(req, res, username, password) {
  const db = await getMongoDb();
  let collection = db.collection("user");

  if (!collection) {
    collection = await db.createCollection("user");
  }

  const data = await collection.findOne({ username: username });
  if (!data) {
    return 0;
  }

  const decodedPassword = decodePassword(password);
  if (data.password != decodedPassword) {
    return 1;
  }

  const token = uuidv1();

  res.cookie("user", JSON.stringify({ username, token }), {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  req.session[token] = username;
  return 2;
}

async function getUserData(req, token) {
  const username = req.session[token];
  const db = await getMongoDb();
  let collection = db.collection("user");

  if (!collection) {
    collection = await db.createCollection("user");
  }

  const data = await collection.findOne({ username: username });

  if (!data) {
    return null;
  }

  return {
    number: data.number,
    phone: data.phone,
    email: data.email,
  };
}

async function register(req, res, username, password, userdata) {
  const db = await getMongoDb();
  let collection = db.collection("user");
  if (!collection) {
    collection = await db.createCollection("user");
  }

  const { number, email, phone } = userdata;

  const data = await collection.findOne({ username: username });
  if (data) {
    return "username";
  }

  for (const key in userdata) {
    const entry = await collection.findOne({ [key]: userdata[key] });

    if (entry) {
      return key;
    }
  }

  const decodedPassword = decodePassword(password);

  collection.insertOne({
    username,
    password: decodedPassword,
    number,
    email,
    phone,
  });

  const token = uuidv1();

  res.cookie("user", JSON.stringify({ username, token }), {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  req.session[token] = username;
  return null;
}

async function logout(req, res) {
  await new Promise((res, rej) =>
    req.session.regenerate(() => {
      res();
    })
  );
  res.clearCookie("user");
  return true;
}

module.exports = { login, register, logout, getUserData };
