
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const cartSchema = new Schema({
   
    _id :{
        required :true ,
        type : String ,

    },
    P


});
//create and pass the schema
module.exports = mongoose.model('Cart', cartSchema );