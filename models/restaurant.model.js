const getDb = require("../utils/mongo.util.js").getDb
const axios = require("axios")
const mongo = require("mongodb")


class Restaurant{
    constructor({
        "id":id,
        "name":name,
        "phone_number":phone_number,
        "address":address,
        "point":point,
        "average_delivery_time":average_delivery_time,
        "menu":menu,
        "image_url":image_url,
        "min_order":min_order,
        "county": county,
        "province":province,
        "working_start":working_start,
        "working_end":working_end

    }){
        this._id = id
        this.name = name
        this.phone_number = phone_number
        this.address = address
        this.point = point
        this.average_delivery_time = average_delivery_time
        this.menu = menu
        this.image_url = image_url
        this.county = county
        this.province = province
        this.min_order = min_order
        this.working_start = working_start
        this.working_end = working_end
    }
    save(){
        const db = getDb()
        return db.collection("Restaurants").insertOne(this)
        
    }
    static findOne(id){
        const db = getDb()
        return db.collection("Restaurants").findOne({"_id":mongo.ObjectId(id)})
    }
    static delete(id){
        const db = getDb()
        return db.collection("Restaurants").deleteOne({"_id":mongo.ObjectId(id)})
    }
    static getAll(){
        const db = getDb()
        return db.collection("Restaurants").find()
    }

    static getRestaurantsByProvince(province){
        const db = getDb()
        return db.collection("Restaurants").find({"province":province})
    }

    static deleteAll(){
        const db = getDb()
        return db.collection("Restaurants").deleteMany({})
    }
}


module.exports = Restaurant