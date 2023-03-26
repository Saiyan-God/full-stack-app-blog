import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://127.0.0.1:27017';
const mongoDb = 'react-blog-db';

let db;

async function connectToDb(cb) {
    const client = new MongoClient(mongoUrl);
    await client.connect();

    db = client.db(mongoDb);
    cb();
}

export {
    db,
    connectToDb
}
