const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Order = require('./models/Order');

app.use(express.json()); 
// with the help of express.json whatever request we will get from the response that will be automatically passed through json
app.use(cors());
// using this our reactjs project will connect to express app on 4000 port

// Database connection with MongoDB61
mongoose.connect("mongodb://aminawebdev:amina29112423s@ac-zgr6xnh-shard-00-00.idlo75h.mongodb.net:27017,ac-zgr6xnh-shard-00-01.idlo75h.mongodb.net:27017,ac-zgr6xnh-shard-00-02.idlo75h.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-9f308e-shard-0&authSource=admin&appName=Cluster0");

// Schema creating for User model

const User = mongoose.model('User',{
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
    addresses:[
    {
        fullName:String,
        phone:String,
        address:String,
        isDefault:{
            type:Boolean,
            default:false
        }
    }
],
    date:{
        type:Date,
        default:Date.now,
    }
});

const Admin = mongoose.model('Admin',{
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    }
});

Admin.findOne({email:"admin@gmail.com"})
.then(async(admin)=>{

    if(!admin){

        await Admin.create({
            email:"admin@gmail.com",
            password:"admin123"
        });

        console.log("Default Admin Created");
    }

})

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running ")
});

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
});



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
});

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
    })
    console.log(product);
    await product.save();
    //By using this above code whatever product we have created that will be automatically saved in the Mongodb database.
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
});

// Creating API For Deleting Products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
});

// Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
});


const validateEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(email);
};

const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

//  Creating Endpoint for registering the User
app.post('/signup',async (req,res)=>{
    let email = req.body.email.trim().toLowerCase();

    if (!validateEmail(email)) {
  return res.json({
    success:false,
    errors:"Invalid Email"
  });
}

if (req.body.password.length < 6) {
  return res.json({
    success:false,
    errors:"Password must be at least 6 characters"
  });
}
    
    let check = await User.findOne({ email:email });

    // let check = await User.findOne({email:req.body.email});
    if(check) {
        return res.status(400).json({success:false,errors:"existing User found with same email address"})
    }
    let cart = {};
    for(let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new User({
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
});

// Line 156 is for, converting User(uppercase U) into User(lowercase u) automatically in the request.
// In line 157, API we will check whether the User has an existing account, if it is there then we will response success false error msg. 
// If there is no User: line 163-166 , then we will create one empty cart and using this cart, 
// line: 167-173 we will create the User where we will add the name, email, password and cart data. After that this created User will be saved in the database using this .save() method in line:175.
//  After that line:177-181 we are creating the token using this object that is the data object where we have the User key and in this User key we have an object with the ID and Userid.
//  After the data object creation, Line: 183-185, we are generating the token for that we are using jwt sign method and here we have passed this data object and here we have added the salt(secret_ecom) using that our token will not be readable. Then we have added one response where we have sent the object(success:true,token).
// chatgpt codes Line:156,157 and 170

// Creating endpoints for User login
app.post('/login',async (req,res)=>{
    let email = req.body.email.trim().toLowerCase();
    if (!validateEmail(email)) {
    return res.json({
        success:false,
        errors:"Please enter a valid email"
    });
}

if (req.body.password.length < 6) {
    return res.json({
        success:false,
        errors:"Password must be at least 6 characters"
    });
  }
    let user = await User.findOne({email:email});
    
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
});

app.post('/admin-login', async(req,res)=>{

    try {

        let admin = await Admin.findOne({
            email:req.body.email
        });

        if(!admin){
            return res.json({
                success:false,
                message:"Admin not found"
            });
        }

        if(admin.password !== req.body.password){
            return res.json({
                success:false,
                message:"Wrong Password"
            });
        }

        res.json({
            success:true,
            message:"Admin Login Successful"
        });

    } catch(error){

        console.log(error);

        res.json({
            success:false,
            message:"Server Error"
        });

    }

});

// Creating endpoint for newcollection data 
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
});

// Creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
});

// Creating middleware to fetch User 
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
// app.post('/addtocart',fetchUser,async (req,res)=>{
//     console.log("Added",req.body.itemId);
//     let userData = await User.findOne({_id:req.user.id});
//     userData.cartData[req.body.itemId] += 1;
//     await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
//     res.send("Added")
// });

//The commented code of addtocart is the code of youtube

// app.post('/addtocart', fetchUser, async (req, res) => {
//     console.log("Added", req.body.itemId);

//     let userData = await User.findOne({ _id: req.user.id });

//     if (!userData.cartData) {
//         userData.cartData = {};
//     }

//     if (!userData.cartData[req.body.itemId]) {
//         userData.cartData[req.body.itemId] = 0;
//     }

//     userData.cartData[req.body.itemId] += 1;

//     await User.findOneAndUpdate(
//         { _id: req.user.id },
//         { cartData: userData.cartData }
//     );

//     res.json({ success: true, message: "Added" });
// });

app.post('/addtocart', fetchUser, async (req,res)=>{

    try {

        let userData = await User.findOne({_id:req.user.id});
        if(!Array.isArray(userData.cartData)){
            userData.cartData = [];
        }

        const { itemId, size } = req.body;

        // check same product + same size

        let existingItem = userData.cartData.find(
            (item)=>
                item.itemId === itemId &&
                item.size === size
        );

        if(existingItem){

            existingItem.quantity += 1;

        } else {

            userData.cartData.push({
                itemId,
                size,
                quantity:1
            });

        }
        userData.markModified('cartData');

        await userData.save();

        res.json({
            success:true,
            message:"Added To Cart"
        });

    } catch(error){

        console.log(error);

        res.status(500).json({
            success:false,
            message:"Server Error"
        });

    }

})

// Creating endpoint to remove product from cartdata
// app.post('/removefromcart',fetchUser,async (req,res)=>{
//     console.log("removed",req.body.itemId);
//     let userData = await User.findOne({_id:req.user.id});
//     if(userData.cartData[req.body.itemId]>0)
//     userData.cartData[req.body.itemId] -= 1;
//     await User.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
//     res.send("Removed")
// });

//The commented code of removefromcart is the code of youtube

// app.post('/removefromcart', fetchUser, async (req, res) => {
//     console.log("Removed", req.body.itemId);

//     let userData = await User.findOne({ _id: req.user.id });

//     if (!userData.cartData) {
//         userData.cartData = {};
//     }

//     if (!userData.cartData[req.body.itemId]) {
//         userData.cartData[req.body.itemId] = 0;
//     }

//     if (userData.cartData[req.body.itemId] > 0) {
//         userData.cartData[req.body.itemId] -= 1;
//     }

//     await User.findOneAndUpdate(
//         { _id: req.user.id },
//         { cartData: userData.cartData }
//     );

//     res.json({ success: true, message: "Removed" });
// });

app.post('/removefromcart', fetchUser, async (req,res)=>{

    try {

        let userData = await User.findOne({_id:req.user.id});

        const { itemId, size } = req.body;

        let itemIndex = userData.cartData.findIndex(
            (item)=>
                item.itemId === itemId &&
                item.size === size
        );

        if(itemIndex > -1){

            userData.cartData[itemIndex].quantity -= 1;

            if(userData.cartData[itemIndex].quantity <= 0){

                userData.cartData.splice(itemIndex,1);

            }

        }

        await userData.save();

        res.json({
            success:true
        });

    } catch(error){

        console.log(error);

        res.status(500).json({
            success:false
        });

    }

})

// Creating endpoint to get cartdata
// app.post('/getcart',fetchUser,async (req,res)=>{
//     console.log("GetCart");
//     let userData = await User.findOne({_id:req.user.id});
//     res.json(userData.cartData);
// });

app.post('/getcart', fetchUser, async (req,res)=>{

    try {

        let userData = await User.findOne({_id:req.user.id});

        res.json(userData.cartData);

    } catch(error){

        console.log(error);

        res.status(500).json({
            success:false
        });

    }

})

//Creating endpoint to get User details in profile page
app.post('/placeorder', fetchUser, async (req, res) => {
  try {
    const { fullName, address, phone, paymentMethod } = req.body;

    if (!fullName || !address || !phone || !paymentMethod) {
      return res.json({
        success: false,
        message: "Please fill all details",
      });
    }

    let user = await User.findById(req.user.id);

    user.address = address;
    await user.save();

    let orderedItems = [];

for (const cartItem of user.cartData) {

    const product = await Product.findOne({
        id: Number(cartItem.itemId)
    });

    if(product){

        orderedItems.push({

            productId: product.id,

            name: product.name,

            image: product.image,

            category: product.category,

            price: product.new_price,

            old_price: product.old_price,

            size: cartItem.size,

            quantity: cartItem.quantity,

        });

    }

}

    const newOrder = new Order({
      userId: req.user.id,
      fullName,
      email: user.email,
      address,
      phone,
      paymentMethod,
      items: orderedItems,
    });

    await newOrder.save();

    user.cartData = [];
    await user.save();

    res.json({
      success: true,
      message: "Order successful",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

app.post('/Userdetails', fetchUser, async (req, res) => {

  const user = await User.findById(req.user.id);

  const defaultAddress = user.addresses.find(
    (addr) => addr.isDefault
  );

  res.json({
    ...user._doc,
    address: defaultAddress?.address || "",
    phone: defaultAddress?.phone || ""
  });

});

app.get("/admin/users", async (req, res) => {
  const users = await User.find();
  const orders = await Order.find();

  res.json({ users, orders });
});

//Creating endpoint to get order details in profile page
app.post('/myorders', fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});
app.post('/deleteorder', fetchUser, async (req, res) => {
  try {
    await Order.findOneAndDelete({
      _id: req.body.orderId,
      userId: req.user.id,
    });

    res.json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

app.put("/order/status/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: "Delivered",
      deliveredDate: new Date(),
    });

    res.json({
      success: true,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

app.post('/add-address', fetchUser, async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

if (!fullName || !phone || !address) {
  return res.json({
    success:false,
    message:"Please fill all fields"
  });
}

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

if (!validatePhone(phone)) {
  return res.json({
    success:false,
    message:"Invalid phone number"
  });
}
    
    const user = await User.findById(req.user.id);
    
    user.addresses.push({
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
        isDefault: user.addresses.length === 0
    });

    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false
    });
  }
});

app.put('/set-default-address/:index', fetchUser, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });

    if(user.addresses[req.params.index]){
      user.addresses[req.params.index].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false
    });

  }

});

app.delete('/delete-address/:index', fetchUser, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    const deletedAddress = user.addresses[req.params.index];

    user.addresses.splice(req.params.index, 1);

    // agar deleted address default tha
    // toh first address ko default bana do

    if (
      deletedAddress?.isDefault &&
      user.addresses.length > 0
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false
    });

  }

});

app.put('/edit-address/:index', fetchUser, async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if(user.addresses[req.params.index]){

      user.addresses[req.params.index].fullName =
        req.body.fullName;

      user.addresses[req.params.index].phone =
        req.body.phone;

      user.addresses[req.params.index].address =
        req.body.address;

    }

    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false
    });

  }

});

app.get('/user/addresses', fetchUser, async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    addresses: user.addresses || []
  });
});


app.listen(port,(error)=>{
    if (!error){
        console.log("Server Running on Port "+port)
    }
    else
    {
        console.log("Error : "+error)
     }
});
