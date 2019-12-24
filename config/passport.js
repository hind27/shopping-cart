const passport =require('passport')
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');


passport.serializeUser(( user,done)=>{
    return done(null , user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById( id  ,('email') ,(err ,user)=>{
      return done(err , user);
  })
})

passport.use('local-signin' ,new localStrategy({
    usernameField : 'email' ,
    passwordField : 'password' ,
    passReqToCallback : true ,
} , (req , email ,password, done)=>{
    User.findOne({email:email},(err ,user)=>{
        if(err){
            return done(err)
        }
        if(!user){
            return done(null , false, req.flash('signinError' ,'this user not found'))

        }
         if( ! user.comparePassword(password)){
              return done(null , false , req.flash('signinError' ,'wrong password'))
         }
          return done(null ,user)
    })
  
}))

passport.use('local-signup' ,new localStrategy({
    usernameField : 'email' ,
    passwordField : 'password' ,
    passReqToCallback : true ,
} , (req , email ,password, done)=>{
    User.findOne({email:email},(err ,user)=>{
          if(err){
              return done(err)
          }
          if(user){
              return done(null , false , req.flash('signupError' ,'this email already exist'))
          }
          const newuser = new User({
          email :email ,
          password :new User().hashPassword(password)
          })
          newuser.save((err ,user)=>{
            if(err){
                return done(err)
            }
            return done(null, user)
        })
    })


}))