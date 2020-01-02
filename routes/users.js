var express = require('express');
var router = express.Router();


// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator');
const User = require('../models/User')
const passport = require('passport')
const csrf = require('csurf')
var Order = require('../models/order');



router.use(csrf());

/* GET users listing. */
router.get('/signup', notLoggedIn, function (req, res, next) {
  var messageeError = req.flash('signupError')
  res.render('user/signup', { message: messageeError ,token : req.csrfToken() })
});


router.post('/signup', [
  check('email').not().isEmpty().isEmail().withMessage('please enter your email'),
  check('email').isEmail().withMessage('Your email is not valid'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 }).withMessage('Your password must be at least 5 characters'),
  check('confirm-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      throw new Error('password and confirm-password not matched')
    }
    return true;
  })
],
  (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var validationMessage = [];
      for (var i = 0; i < errors.errors.length; i++) {
        validationMessage.push(errors.errors[i].msg)
      }
      req.flash('signupError', validationMessage);
      res.redirect('signup')
      return;
      } 
       next();
    }  ,  passport.authenticate('local-signup' , {
      session : false ,
      successRedirect: 'signin',
      failureRedirect: 'signup',
      failureFlash: true 
    }))


router.get('/profile',isLoggedIn ,(req, res, next) => {
 if(req.user.cart){
    totalProducts = req.user.cart.totalquantity
  }else{
    totalProducts = 0
 }
 Order.find( {user : req.user._id} ,(err ,result)=>{
  if (err) {
       console.log(err)
   }
   console.log(result) 
   res.render('user/profile',{checkuser :true , checkProfile :true , totalProducts : totalProducts , userOrder :result })
 })
 
})


router.get('/signin',notLoggedIn ,(req, res, next) => {
  var massagesError = req.flash('signinError');
  console.log(req.csrfToken())
  res.render('user/signin', { massages: massagesError , token : req.csrfToken() });
})

router.post('/signin', [
  check('email').not().isEmpty().isEmail().withMessage('please enter your email'),
  check('email').isEmail().withMessage('Your email is not valid'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 }).withMessage('Your password must be at least 5 characters')

], (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var validationMessage = [];
    for (var i = 0; i < errors.errors.length; i++) {
      validationMessage.push(errors.errors[i].msg)
    }
    req.flash('signinError', validationMessage);
    res.redirect('signin')
    return;
  }
  next();

}, passport.authenticate('local-signin', {
  
  successRedirect: 'profile',
  failureRedirect: 'signin',
  failureFlash: true,
}))

router.get('/logout',isLoggedIn,(req ,res , next)=>{
  req.logOut();
  res.redirect('/');
  
})

router.use('/', notLoggedIn,  (req, res, next)=> {
  next();
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('signin');
}


function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
}