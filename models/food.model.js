const getDb = require("../utils/mongo.util.js").getDb
const axios = require("axios")
const mongo = require("mongodb")

class Food{
    /**
     * 
     * @param {id} mongo.ObjectId,
     * @param {name} String
     * @param {price} Double
     * @param {restaurantId} mongo.ObjectId
     * @param {content} String
     * @param {image_url} String
     */
    constructor({
        "id":id,
        "name":name,
        "price":price,
        "restaurant_id":restaurant_id,
        "content":content,
        "image_url":image_url
    }){
        this._id = id;
        this.name = name;
        this.price = price;
        this.restaurant_id = restaurant_id;
        this.content = content;
        this.image_url = image_url
    }
    save(){
        const db = getDb()
        return db.collection("Foods").insertOne(this)
    }
    static findOne(id){
        const db = getDb()
        return db.collection("Foods").findOne({"_id":mongo.ObjectId(id)})
    }
    static delete(id){
        const db = getDb()
        return db.collection("Foods").deleteOne({"_id":mongo.ObjectId(id)})
    }
    static getAll(){
        const db = getDb()
        return db.collection("Foods").find()
    }
    static deleteAll(){
        const db = getDb()
        return db.collection("Foods").deleteMany({})
    }

    static findByRestaurantId(rest_id){
        const db = getDb()
        return db.collection("Foods").find({"restaurant_id":rest_id})
    }

}

module.exports = Food