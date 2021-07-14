const express = require('express');
const app = express();
const path = require ('path');
const router = express.Router();
const port = process.env.PORT || 3000; 
app.use(express.static(path.join(__dirname,'public')));

router.get('/home',(req,res)=>{
   res.sendFile(path.join(__dirname +'/home.html'));
});
router.get('/customer',(req,res)=>{
    res.sendFile(path.join(__dirname +'/customer.html'));
});
router.get('/product',(req,res)=>{
    res.sendFile(path.join(__dirname +'/product.html'));
});
router.get('/category',(req,res)=>{
    res.sendFile(path.join(__dirname +'/category.html'));
});
router.get('/invoice',(req,res)=>{
    res.sendFile(path.join(__dirname +'/invoice.html'));
});
app.use('/', router);

app.listen(port);