var express = require('express');
var router = express.Router();

const Product = require('../models/Product');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  console.log(req.user);
  Product.find({},(error , doc)=>{
    if(error){
      console.log(error)
    }
    
    var ProductGrid =[];
    var coldGrid = 3 ;
     // method make array of array for make Grid
    for(var i=0; i<doc.length ; i+=coldGrid){
      ProductGrid.push(doc.slice( i, i+coldGrid))
    }
   
    res.render('index', { title: 'Shopping-cart' , products: ProductGrid , checkuser : req.isAuthenticated() });
  })
 
})

module.exports = router;