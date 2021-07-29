const mongo = require("mongodb");

const mongoDB =
  "mongodb+srv://liaoyuxuan:18322043@cluster0.5tetg.mongodb.net/signin_data?retryWrites=true&w=majority";

async function getMongoDb() {
  // Set up mongo connection
  const transfer = await mongo.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const database = transfer.db("webhomework11");
  return database;
}

module.exports = { getMongoDb };
