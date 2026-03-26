require("dotenv").config();
const mongoClient = require("mongodb").MongoClient;
const MONGO_URL = process.env.MONGO_URL;

let db;

async function initDatabase(callback) {
  if (!MONGO_URL) {
    throw new Error("Environment variable MONGO_URL is not set");
  }
  if (db) {
    console.log("Database is already initialized");
    return callback(null, db);
  }

  mongoClient.connect(MONGO_URL)
    .then((client) => {
      db = client.db();
      console.log("Connected to MongoDB");
      callback(null, db);
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
      callback(err);
    });
}

function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

module.exports = { initDatabase, getDatabase };