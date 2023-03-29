import { MongoClient } from 'mongodb';
const mongoDb = 'react-blog-db';

let db;

async function connectToDb(cb) {
    const mongoUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB}/?retryWrites=true&w=majority`;

    const client = new MongoClient(mongoUrl);
    await client.connect();

    db = client.db(mongoDb);
    cb();
}

export {
    db,
    connectToDb
}
