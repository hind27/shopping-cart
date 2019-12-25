
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const cartSchema = new Schema({
   
    _id :{
        required : true ,
        type : String ,

    },
    totalquantity :{
             required :true ,
             type: Number ,
    },
    totalPrice :{
        required : true ,
        type : Number ,

    },
    selectedProduct :{
        required : true ,
        type : Array ,

    }

});
//create and pass the schema
module.exports = mongoose.model('Cart', cartSchema );