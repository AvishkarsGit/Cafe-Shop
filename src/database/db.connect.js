const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://shrvanji98600:Project2024@eventclustor.xmzfc.mongodb.net/cafe_shop?retryWrites=true&w=majority&appName=EventClustor').then(()=>{
  console.log("Data base is connected")
}).catch((error)=>{
  console.log("Error:",error)
})

const productModel = mongoose.Schema({
  ProductName:{
    type:String,
    required:true
  },
  ProductPrice:{
    type:String,
    required:true
  },
  Description:{
    type:String
  },
  imgUrl:{
    type:String
  }
});

module.exports = mongoose.model("product",productModel);