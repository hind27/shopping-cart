var express = require('express');
var router = express.Router();

const Product = require('../models/Product');
const Cart = require('../models/cart')

/* GET home page. */
router.get('/', function (req, res, next) {
  var totalProducts = null;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      totalProducts = req.user.cart.totalquantity;
    } else {
      totalProducts = 0;
    }
  }
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

    res.render('index', {
      title: 'Shopping-cart'
      , products: ProductGrid
      , checkuser: req.isAuthenticated()
      , totalProducts: totalProducts
    });
  })

})


router.get('/addTocart/:id/:price/:name', (req, res, next) => {
 
  var productId = req.user._id;
  const newproductPrice = parseInt(req.params.price, 10)
  const newProduct = {
    _id: req.params.id,
    price: newproductPrice,
    name: req.params.name,
    quantity: 1,
  }

  Cart.findById(productId, (err, cart) => {
    if (err) {
      console.log(err)
    }
    if (!cart) {
      const newCart = new Cart({
        _id: productId,
        totalquantity: 1,
        totalPrice: newproductPrice,
        selectedProduct: [newProduct]
      })

      newCart.save((error, doc) => {
        if (error) {
          console.log(error)
        }
        console.log(doc)
      })
    }
    if (cart) {
      var indexofProduct = -1;
      for (var i = 0; i < cart.selectedProduct.length; i++) {
        if (req.params.id === cart.selectedProduct[i]._id) {
          indexofProduct = i;
          break;
        }
      }
      if (indexofProduct >= 0) {
        cart.selectedProduct[indexofProduct].quantity = cart.selectedProduct[indexofProduct].quantity + 1;
        cart.selectedProduct[indexofProduct].price = cart.selectedProduct[indexofProduct].price + newproductPrice;
        cart.totalquantity = cart.totalPrice + 1;
        cart.totalPrice = cart.totalPrice + newproductPrice ;
        
        Cart.updateOne({ _id: productId }, { $set: cart }, (error, doc) => {
          if (error) {
            console.log(error)
          }
          console.log(doc)
          console.log(cart)
        })

      } else {
        cart.totalquantity = cart.totalquantity + 1;
        cart.totalPrice = cart.totalPrice + newproductPrice;
        cart.selectedProduct.push(newProduct)

        Cart.updateOne({ _id: productId }, {$set: cart }, (error, doc) => {
          if (error) {
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

router.get('/shopping-cart' ,(req , res , next)=>{
  if(!req.isAuthenticated()){
    res.redirect('/users/signin')
    return ;
  }
  if(!req.user.cart){
    res.redirect('/')
       return ;
}
 const userCart =req.user.cart
 const totalProducts = req.user.cart.totalquantity
 res.render('shoppingcart',{userCart : userCart ,checkuser : true ,totalProducts : totalProducts})
})


module.exports = router;