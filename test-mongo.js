const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URL;
console.log('Testing connection to:', uri ? uri.replace(/:([^@]+)@/, ':****@') : 'undefined');

if (!uri) {
  console.error('MONGO_URL is not set');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    const db = client.db('complaint_management');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.close();
  }
}

run();
