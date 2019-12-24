
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const productSchema = new Schema({
   
    imagePath : {
        type : String ,
        required : true 
    } ,
    productName :{
        type : String ,
        required : true
    } ,
    information :{
        required : true ,
        type : {
            storageCapacity : Number ,
            numberOfSIM : String ,
            memoryRAM : Number,
            color : String ,
        }
    } ,
    price :{
        type : Number ,
        required : true
    } ,


});
//create and pass the schema
module.exports = mongoose.model('Product', productSchema);