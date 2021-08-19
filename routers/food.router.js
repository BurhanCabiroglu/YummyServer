const { default: axios } = require("axios")
const express = require("express")
const router = express.Router()
const mongodb = require("mongodb")
const Food = require("../models/food.model")
const multer  = require('multer')
const upload = multer({ dest: 'public/images/' })
const fs = require('fs')




router.post("/",upload.single('file'),async (req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
    let restaurant_id = req.body.restaurant_id;
    let content = req.body.content;
    let price = req.body.price;
    
    const fullUrl = req.protocol + '://' + req.get('host')+"/restaurant/"+restaurant_id;
    var rest = await axios.get(fullUrl)
    if(rest.status!=200) return res.status(401).json({error:"restaurant can not find"})
    if(!req.file) return res.status(400).json({"error":"no image found"})
    var file = './public/images/' + req.file.originalname;
    fs.rename(req.file.path,file,(err)=>{
        if(err) res.status(400).json({"error":"file can not upload"})
    })

    const food = new Food({
        "id":!id?mongodb.ObjectId():id,
        "name":name,
        "restaurant_id":restaurant_id,
        "content":content,
        "price":price,
        "image_url":"/images/"+req.file.originalname,
    })

    food.save().then(resp=>{        
        return res.status(200).json(food)
    }).catch(error=>{
        return res.status(400).json({"error":"food can not created"})
    })
    
})





router.get("/all",async (req,res)=>{
    Food.getAll().toArray((err,result)=>{
        if(err) return res.status(404).json({"error":"food can not get"})  
        return res.status(200).json(result)
    })
})



router.get("/:id",async (req,res)=>{
    let rest_json = await Food.findOne(req.params.id)
    if(rest_json){
        res.status(200).json(rest_json)
    }
    else{
        return res.status(404).json({"error":"food can not get"})  
    }
})

router.delete("/all",async (req,res)=>{
    Food.deleteAll().then((resp)=>{
        return res.status(200).json(resp)
    })
})

router.delete("/:id",async (req,res)=>{
    if(req.params.id.length<24) return res.status(400).json({"error":"Wrong food id"})  
    Food.delete(req.params.id).then((resp)=>{
        if(resp["deletedCount"]!=0){
            return res.status(200).json(resp)
        }
        else{
            return res.status(404).json(resp)  
        }
    })
    
})


router.get("/",async (req,res)=>{
    let restaurant_id = req.query.restaurant_id
    Food.findByRestaurantId(restaurant_id).toArray((err,result)=>{
        if(err) return res.status(404).json({"error":"restaurant can not get"})  
        return res.status(200).json(result)
    })
})

module.exports = router