const getDb = require("../utils/mongo.util.js").getDb

const mongo = require("mongodb")
class User{
    /**
     * @param {mongo.ObjectId} id
     * @param {String} name
     * @param {String} surname
     * @param {String} email
     * @param {String} password
     */
    constructor({
        "id":id,
        "name":name,
        "surname":surname,
        "email":email,
        "password":password,
        "orders":orders,
        "address":address,
        "county":county,
        "province":province,
        "phone_number":phone_number
    }){
        this._id = id
        this.name = name
        this.surname = surname
        this.email = email
        this.password = password
        this.orders = orders
        this.province = province
        this.county = county
        this.address = address
        this.phone_number = phone_number
    }
    save(){
        const db = getDb()
        return db.collection("Accounts").insertOne(this)
    }
    static findOne(id){
        const db = getDb()
        return db.collection("Accounts").findOne({"_id":mongo.ObjectId(id)})
    }
    static delete(id){
        const db = getDb()
        return db.collection("Accounts").deleteOne({"_id":mongo.ObjectId(id)})
    }
    static getAll(){
        const db = getDb()
        return db.collection("Accounts").find()
    }
    static deleteAll(){
        const db = getDb()
        return db.collection("Accounts").deleteMany({})
    }

    static login(email){
        const db = getDb()
        return db.collection("Accounts").findOne({"email":email})
    }
}


module.exports = User