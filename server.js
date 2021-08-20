require("dotenv").config()

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoConnect = require("./utils/mongo.util").mongoConnect
const userRouter = require("./routers/user.router")
const restaurantRouter = require("./routers/restaurant.router")
const foodRouter = require("./routers/food.router")
const orderRouter = require("./routers/order.router")

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static('public'))


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.get('host')); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/restaurant",restaurantRouter)
app.use("/account",userRouter)
app.use("/food",foodRouter)
app.use("/order",orderRouter)



app.use((err,req,res,next)=>{
    if(err){
        res.sendStatus(400)
    }
})

app.use((req,res,next)=>{
    return res.sendStatus(404)
})


mongoConnect((res)=>{
    console.log("\x1b[35m%s\x1b[0m","MongoDB Connected")
    app.listen(process.env.PORT,()=>{
        console.log("\x1b[34m%s\x1b[0m","Web Service Running: "+process.env.PORT)
    })  
})
