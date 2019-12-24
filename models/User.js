const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

const userSechema = new Schema({

    email : {
        type :String ,
        required : true 
        
    },
     password :{
         type: String ,
         required :true
     } ,
});
userSechema.methods.hashPassword = function(password){
     return bcrypt.hashSync(password ,bcrypt.genSaltSync(5),null)
 }
 userSechema.methods.comparePassword = function(password){
     return bcrypt.compareSync(password, this.password)
 }
module.exports = mongoose.model('User' , userSechema) ;