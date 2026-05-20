const mongoose = require('mongoose');

const Order = mongoose.model('Orders', {
  userId: String,
  fullName: String,
  email: String,
  address: String,
  phone: String,
  paymentMethod: String,

  items: [
    {
      productId: Number,
      name: String,
      image: String,
      category: String,
      price: Number,
      old_price: Number,
      quantity: Number,
    }
  ],

  date: {
    type: Date,
    default: Date.now,
  },
  status:{
    type:String,
    default:"Shipped"
  },
  deliveredDate:{
    type: Date,
    default:null,
  },
});

module.exports = Order;