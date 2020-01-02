var express = require('express');
var router = express.Router();

const stripe = require('stripe')('sk_test_RVDx5vSzXrfSe3NfZQo7zEpQ00D0aSMO1Z');
const Product = require('../models/Product');
const Cart = require('../models/cart')
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
  const successMas = req.flash('success')[0];
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
      , totalProducts: totalProducts,
      successMas: successMas,
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
        cart.totalquantity = cart.totalquantity + 1;
        cart.totalPrice = cart.totalPrice + newproductPrice;

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

        Cart.updateOne({ _id: productId }, { $set: cart }, (error, doc) => {
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

router.get('/shopping-cart', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/users/signin')
    return;
  }
  if (!req.user.cart) {
    res.render('shoppingcart', { checkuser: true, totalProducts: 0 })
    return;
  }
  const userCart = req.user.cart
  const totalProducts = req.user.cart.totalquantity
  res.render('shoppingcart', { userCart: userCart, checkuser: true, totalProducts: totalProducts })
})

router.get('/increaseProduct/:index', (req, res, next) => {
  const index = req.params.index
  const userCart = req.user.cart
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity
  userCart.selectedProduct[index].quantity = userCart.selectedProduct[index].quantity + 1;
  userCart.selectedProduct[index].price = userCart.selectedProduct[index].price + productPrice;

  userCart.totalquantity = userCart.totalquantity + 1
  userCart.totalPrice = userCart.totalPrice + productPrice;
  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, doc) => {
    if (err) {
      console.log(error)
    }
    console.log(doc)
    res.redirect('/shopping-cart')
  })

})

router.get('/decreaseProduct', (req, res, next) => {
  const index = req.params.index
  const userCart = req.user.cart
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity

  userCart.selectedProduct[index].quantity = userCart.selectedProduct[index].quantity - 1;
  userCart.selectedProduct[index].price = userCart.selectedProduct[index].price - productPrice;

  userCart.totalquantity = userCart.totalquantity - 1
  userCart.totalPrice = userCart.totalPrice - productPrice;
  Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, doc) => {
    if (err) {
      console.log(error)
    }
    console.log(doc)
    res.redirect('/shopping-cart')
  })
})
router.get('/deleteProduct/:index', (req, res, next) => {
  const index = req.params.index;
  const userCart = req.user.cart;
  if (userCart.selectedProduct.length <= 1) {
    Cart.deleteOne({ _id: userCart._id }, (err, doc) => {
      if (err) {
        console.log(error)
      }
      console.log(doc)
      res.redirect('/shopping-cart')

    })
  } else {
    userCart.totalPrice = userCart.totalPrice - userCart.selectedProduct[index].price;
    userCart.totalquantity = userCart.totalquantity - userCart.selectedProduct[index].quantity;

    userCart.selectedProduct.splice(index, 1);
    Cart.updateOne({ _id: userCart._id }, { $set: userCart }, (err, doc) => {
      if (err) {
        console.log(error)
      }
      console.log(doc)
      res.redirect('/shopping-cart')
    })
  }
})

router.get('/checkout', (req, res, next) => {
  const totalProducts = req.user.cart.totalquantity
  const errormas = req.flash('error')[0];
  res.render('checkout', {
    checkuser: true,
    totalProducts: totalProducts,
    totalPrice: req.user.cart.totalPrice,
    errormas: errormas
  })
})

router.post('/checkout', (req, res, next) => {
  stripe.charges.create(
    {
      amount: req.user.cart.totalPrice * 100,
      currency: "usd",
      source: req.body.stripeToken,
      description: "charge for  test@example.com"
    },
    function (err, charge) {
      if (err) {
        // Deal with an error (will be `null` if no error occurred).
        console.log(err)
        req.flash('error', err.raw.message);
        res.redirect('/checkout')

      }
      console.log(charge)
      req.flash('success', 'Successfully bought product!')

      const order = new Order({
        user: req.user._id,
        cart: req.user.cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id,
        orderPrice: req.user.cart.totalPrice,
      });

      order.save((err, result) => {
        if (err) {
          console.log(err)
        }
        console.log(result)
        
        Cart.deleteOne({ _id: req.user.cart._id }, (err, doc) => {
          if (err) {
            console.log(err)
          }
          console.log(doc)
          res.redirect('/')
        })
      })
   

    }
  );

})


module.exports = router;