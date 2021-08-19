const express = require("express")
const User = require("../models/user.model.js")
const mongodb = require("mongodb")
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })
const fs = require('fs')
const router = express.Router()
const jwt = require("jsonwebtoken")



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }


router.get("/login",async (req,res)=>{
    if(req.user){
        return res.json(user)
    }
    const email = req.body.email
    const password = req.body.password
    if(!email||!password) 
        return res.sendStatus(400)
    const user = {email:email,password:password}
    const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    const account = await User.login(email)
    if(account){
        if(account.password != password){
            return res.status(400).json({"error":"wrong password"}) 
        }
        res.status(200).json({account:account,token:token})
    }
    else{
        return res.status(404).json({"error":"user can not find"})  
    }
})

router.get("/profile",authenticateToken,async (req,res)=>{
    const email = req.user.email
    const password = req.user.password
    const account = await User.login(email)
    if(account){
        if(account.password != password){
            return res.status(400).json({"error":"wrong password"}) 
        }
        res.status(200).json(account)
    }
})


router.post("/",async (req,res)=>{
    let id = req.body.id
    let name = req.body.name
    let surname = req.body.surname
    let email = req.body.email
    let password = req.body.password
    let phonenum = req.body.phone_number
    let address = req.body.address
    let province = req.body.province
    let orders = req.body.orders
    let county = req.body.county


    const user = new User({
        "id":!id?mongodb.ObjectId():id,
        "name":name,
        "surname":surname,
        "password":password,
        "email":email,
        "phone_number":phonenum,
        "address":address,
        "province":province,
        "county":county,
        "orders":!orders?[]:orders
    })
    user.save().then(resp=>{        
        return res.status(200).json(user)
    }).catch(error=>{
        return res.status(400).json({"error":"user can not created"})
    })
})

router.get("/all",async (req,res)=>{
    User.getAll().toArray((err,result)=>{
        if(err) return res.status(404).json({"error":"users can not get"})  
        return res.status(200).json(result)
    })
})

router.get("/:id",async (req,res)=>{
    let user_json = await User.findOne(req.params.id)
    if(user_json){
        res.status(200).json(user_json)
    }
    else{
        return res.status(404).json({"error":"user can not get"})  
    }
})

router.delete("/all",async (req,res)=>{
    User.deleteAll().then((resp)=>{
        return res.status(200).json(resp)
    })
})

router.delete("/:id",async (req,res)=>{
    if(req.params.id.length<24) return res.status(400).json({"error":"Wrong user id"})  
    User.delete(req.params.id).then((resp)=>{
        if(resp["deletedCount"]!=0){
            return res.status(200).json(resp)
        }
        else{
            return res.status(404).json(resp)  
        }
    })
    
})


module.exports = router