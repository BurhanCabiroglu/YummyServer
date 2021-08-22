const { default: axios } = require("axios")
const express = require("express")
const router = express.Router()
const mongodb = require("mongodb")
const FoodOrder = require("../models/order.model")

router.post("/",async (req,res)=>{
    let id = req.body.id;
    let account_id = req.body.account_id;
    let restaurant_id = req.body.restaurant_id;
    let food_id = req.body.food_id
    let restaurant_point = req.body.restaurant_point

    /* const fullUrlRestaurant = req.protocol + '://' + req.get('host')+"/restaurant/"+restaurant_id;
    const fullUrlAccount = req.protocol + '://' + req.get('host')+"/account/"+account_id;
    const fullUrlFood = req.protocol + '://' + req.get('host')+"/food/"+food_id;
    console.log(fullUrlRestaurant);
    console.log(fullUrlAccount);
    console.log(fullUrlFood)
    var restaurantRes = await axios.get(fullUrlRestaurant)
    var foodRes = await axios.get(fullUrlFood)
    var accountRes = await axios.get(fullUrlAccount)

    if(restaurantRes.status!=200) return res.status(401).json({error:"restaurant can not find"})
    if(foodRes.status!=200) return res.status(401).json({error:"food can not find"})
    if(accountRes.status!=200) return res.status(401).json({error:"account can not find"}) */
    const today = new Date(Date.now())
    const foodOrder = new FoodOrder({
        "id":!id?mongodb.ObjectId():id,
        "account_id":account_id,
        "restaurant_id":restaurant_id,
        "food_id":food_id,
        "restaurant_point": restaurant_point,
        "order_date": today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear()
    })
    foodOrder.save().then((resp)=>{        
        return res.status(200).json(foodOrder)
    }).catch(error=>{
        return res.status(400).json({"error":"order can not created"})
    })
})
router.get("/all",(req,res)=>{
    FoodOrder.getAll().toArray((err,result)=>{
        if(err) return res.status(404).json({"error":"order can not get"})  
        return res.status(200).json(result)
    })
})
router.get("/:id",async (req,res)=>{
    let rest_json = await FoodOrder.findOne(req.params.id)
    if(rest_json){
        res.status(200).json(rest_json)
    }
    else{
        return res.status(404).json({"error":"order can not get"})  
    }
})



router.get("/",(req,res)=>{
    let account_id = req.query.account_id
    FoodOrder.getByAccountId(account_id).toArray((err,result)=>{
        if(err) return res.status(404).json({"error":"order can not get"})  
        return res.status(200).json(result)
    })
})


router.delete("/all",(req,res)=>{
    FoodOrder.deleteAll().then((resp)=>{
        return res.status(200).json(resp)
    })
})

module.exports = router
