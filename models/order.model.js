const getDb = require("../utils/mongo.util.js").getDb
const mongo = require("mongodb")

class FoodOrder{
    constructor({
        "id":id,
        "restaurant_id":restaurant_id,
        "food_id":food_id,
        "account_id":account_id,
        "order_date":order_date
    }){
       this._id = id;
       this.restaurant_id = restaurant_id;
       this.food_id = food_id;
       this.account_id = account_id;
       this.order_date = order_date;
    }

    save(){
        const db = getDb()
        return db.collection("Orders").insertOne(this)
    }
    static deleteAll(){
        const db = getDb()
        return db.collection("Orders").deleteMany({})
    }
    static getAll(){
        const db = getDb()
        return db.collection("Orders").find()
    }
    static getByAccountId(account_id){
        const db = getDb()
        return db.collection("Orders").find({"account_id":account_id})
    }

    static findOne(id){
        const db = getDb()
        return db.collection("Orders").findOne({"_id":mongo.ObjectId(id)})
    }
    static delete(id){
        const db = getDb()
        return db.collection("Orders").deleteOne({"_id":mongo.ObjectId(id)})
    }
}

module.exports = FoodOrder