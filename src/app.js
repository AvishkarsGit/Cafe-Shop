const express = require('express');
const productData = require('./database/db.connect')
const app = express();
const PORT = 4000

app.set("view engine","ejs");
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(PORT,()=>console.log(`Server is Started on ${PORT}`))

app.get('/',(req,res)=>{
  res.render('index')
})

app.post('/create',async(req,res)=>{
  const {ProductName,ProductPrice,Description,imgUrl}=req.body;
  const product = await productData.create({
    ProductName,
    ProductPrice,
    Description,
    imgUrl
  })
  res.redirect('read');
})

app.get("/read",async(req,res)=>{
      let cafeproduct = await productData.find();
      res.render('read',{cafeproduct})
})

app.get('/delete/:id',async(req,res)=>{
  const products =await productData.findByIdAndDelete({_id:req.params.id});
  res.redirect('/read')
})

