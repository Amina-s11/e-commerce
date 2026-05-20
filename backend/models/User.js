const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    default: '',
  },
  // cartData:{
  //   itemId:Number,
  //   size:String,
  //   quantity:Number,
  // },
  cartData:{
    type: Array,
    default:[]
  },
  addresses: [
    {
      fullName: String,
      phone: String,
      address: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = User;