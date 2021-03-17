import { MongoClient, MongoError, Db, Collection } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbname = '1schachcomputer';
const dbClient = new MongoClient(url, { useUnifiedTopology: true});
let db: Db;

function connectDB():Promise<MongoClient> {
    return new Promise((resolve, reject) => {
        dbClient.connect((err: MongoError) => {
            if (err) reject(err.stack);
            db = dbClient.db(dbname);
            resolve(dbClient);
        });
    });
};

const getCollection = (collectionName: string):Collection => db.collection(collectionName);

export { connectDB, getCollection };
