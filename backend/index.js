const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json()); 
// with the help of express.json whatever request we will get from the response that will be automatically passed through json
app.use(cors());
// using this our reactjs project will connect to express app on 4000 port

// Database connection with MongoDB61
mongoose.connect("mongodb://aminawebdev:amina29112423s@ac-zgr6xnh-shard-00-00.idlo75h.mongodb.net:27017,ac-zgr6xnh-shard-00-01.idlo75h.mongodb.net:27017,ac-zgr6xnh-shard-00-02.idlo75h.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-9f308e-shard-0&authSource=admin&appName=Cluster0");

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running ")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})



// Schema for creating Products

const Product = mongoose.model("product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    //By using this above code whatever product we have created that will be automatically saved in the Mongodb database.
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API For Deleting Products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    });
});

// Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema creating for User model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//  Creating Endpoint for registering the user
app.post('/signup',async (req,res)=>{
    let email = req.body.email.trim().toLowerCase();
    let check = await Users.findOne({ email:email });

    // let check = await Users.findOne({email:req.body.email});
    if(check) {
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for(let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        // email:req.body.email,
        email:email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// Line 156 is for, converting User(uppercase U) into user(lowercase u) automatically in the request.
// In line 157, API we will check whether the user has an existing account, if it is there then we will response success false error msg. 
// If there is no user: line 163-166 , then we will create one empty cart and using this cart, 
// line: 167-173 we will create the user where we will add the name, email, password and cart data. After that this created user will be saved in the database using this .save() method in line:175.
//  After that line:177-181 we are creating the token using this object that is the data object where we have the user key and in this user key we have an object with the ID and userid.
//  After the data object creation, Line: 183-185, we are generating the token for that we are using jwt sign method and here we have passed this data object and here we have added the salt(secret_ecom) using that our token will not be readable. Then we have added one response where we have sent the object(success:true,token).
// chatgpt codes Line:156,157 and 170

// Creating endpoints for user login
app.post('/login',async (req,res)=>{
    let email = req.body.email.trim().toLowerCase();
    let user = await Users.findOne({email:email});

    // let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

// Creating endpoint for newcollection data 
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// Creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

// Creating middleware to fetch user 
    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try {
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            } catch (error) {
                res.status(401).send({errors:"please authenticate using a valid token"})
            }
        }
    }

// Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})


// Creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")
})

// Creating endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


app.listen(port,(error)=>{
    if (!error){
        console.log("Server Running on Port "+port)
    }
    else
    {
        console.log("Error : "+error)
     }
})