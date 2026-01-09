import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("Please define MONGO_URL in .env.local");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
