var express = require('express');
var router = express.Router();

const Product = require('../models/Product');
const Cart = require('../models/cart')

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session);
  console.log(req.user);
  Product.find({}, (error, doc) => {
    if (error) {
      console.log(error)
    }

    var ProductGrid = [];
    var coldGrid = 3;
    // method make array of array for make Grid
    for (var i = 0; i < doc.length; i += coldGrid) {
      ProductGrid.push(doc.slice(i, i + coldGrid))
    }

    res.render('index', { title: 'Shopping-cart', products: ProductGrid, checkuser: req.isAuthenticated() });
  })

})


router.get('/addTocart/:id/:price/:name', (req, res, next) => {

  
  
  var productId = req.user._id;
  const newproductPrice =parseInt(req.params.price ,10)
  const newProduct = {
   _id: req.params.id,
    price: newproductPrice,
    name : req.params.name ,
    quantity : 1 ,
  }
  
  Cart.findById(productId, (err, cart) => {
    if (err) {
      console.log(err)
    }
    if(!cart){
      const newCart = new Cart({
        _id : productId ,
        totalquantity :  1,
        totalPrice : newproductPrice ,
        selectedProduct :[newProduct]
      })

      newCart.save((error ,doc)=>{
        if(error){
          console.log(error)
        }
        console.log(doc)
      })
    }
    if(cart){
      var indexofProduct = -1 ;
      for (let i = 0; i < cart.selectedProduct.length; i++) {
        if(req.params.id === cart.selectedProduct[i]._id){
          indexofProduct = i;
          break ;
        }
      }
      if(indexofProduct>=0){
      cart.selectedProduct[indexofProduct].quantity = cart.selectedProduct[indexofProduct].quantity + 1 ;
      }else{
        cart.totalquantity =cart.totalquantity + 1 ;
        cart.totalPrice =  cart.totalPrice + newproductPrice ;
        cart.selectedProduct .push(newProduct)
        cart.updateOne({_id : productId } ,{$set : cart} ,(error ,doc)=>{
          if(error){
            console.log(error)
          }
          console.log(doc)
          console.log(cart)
        })
      }
    } 
  }) 
   res.redirect('/')
})
module.exports = router;