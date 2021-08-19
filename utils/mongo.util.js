require("dotenv").config()

const mongodb = require('mongodb');
const { env } = require("process");

const mongoClient = mongodb.MongoClient

let _db;

function mongoConnect(callback){
    let uri = process.env.MONGO_URL

    const connection = mongoClient.connect(uri,{ useUnifiedTopology: true }).then(res=>{
        console.log("\x1b[32m%s\x1b[0m","Mongodb Connection Successful!")
        _db = res.db()
        callback(res)
    })
    
    .catch(err=>{
        throw err
    })

    return connection
}

const getDb = () => {
    if(_db){
        return _db
    }
    
    console.log("\x1b[31m%s\x1b[0m","Database Not Found!")
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;