const { default: axios } = require("axios")
const express = require("express")
const router = express.Router()
const mongodb = require("mongodb")
const Restaurant = require("../models/restaurant.model")
const Food = require("../models/food.model")
const multer  = require('multer')
const upload = multer({ dest: 'public/images/' })
const fs = require('fs')



router.post("/", upload.single('file'), async (req,res)=>{
    console.log("buraya post geldi")
    let id = req.body.id
    let name = req.body.name
    let phone_number = req.body.phone_number
    let address = req.body.address 
    let point = req.body.point
    let average_delivery_time = req.body.phone_number
    let province = req.body.province
    let county = req.body.county
    let menu = req.body.menu
    let min_order = req.body.min_order
    let working_start = req.body.working_start
    let working_end = req.body.working_end

    if(!req.file) return res.status(400).json({"error":"no image found"})
    var file = './public/images/' + req.file.originalname;
    fs.rename(req.file.path,file,(err)=>{
        if(err) res.status(400).json({"error":"file can not upload"})
    })
    

    const restaurant = new Restaurant({
        "id":!id?mongodb.ObjectId():id,
        "name":name,
        "phone_number":phone_number,
        "address":address,
        "province":province,
        "county":county,
        "point":point,
        "average_delivery_time":average_delivery_time,
        "menu":!menu?[]:menu,
        "image_url":"/images/"+req.file.originalname,
        "min_order":min_order,
        "working_start":working_start,
        "working_end":working_end
    })


    restaurant.save().then(resp=>{        
        return res.status(200).json(restaurant)
    }).catch(error=>{
        return res.status(400).json({"error":"restaurant can not created"})
    })
})

router.get("/all",async (req,res)=>{
    Restaurant.getAll().toArray((err,result)=>{
        if(err) return res.status(404).json({"error":"restaurant can not get"})  
        return res.status(200).json(result)
    })
})



router.get("/:id",async (req,res)=>{
    let rest_json = await Restaurant.findOne(req.params.id)
    if(rest_json){
        res.status(200).json(rest_json)
    }
    else{
        return res.status(404).json({"error":"restaurant can not get"})  
    }
})

router.delete("/all",async (req,res)=>{
    Restaurant.deleteAll().then((resp)=>{
        return res.status(200).json(resp)
    })
})

router.delete("/:id",async (req,res)=>{
    if(req.params.id.length<24) return res.status(400).json({"error":"Wrong restaurant id"})  
    Restaurant.delete(req.params.id).then((resp)=>{
        if(resp["deletedCount"]!=0){
            return res.status(200).json(resp)
        }
        else{
            return res.status(404).json(resp)  
        }
    })
    
})


router.get("/",async (req,res)=>{
    let province = req.query.province
    Restaurant.getRestaurantsByProvince(province).toArray((err,result)=>{
        if(err) return res.status(404).json({"error":"restaurant can not get"})  
        return res.status(200).json(result)
    })
})


module.exports = router