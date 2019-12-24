const Product = require('../models/Product');

const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/shopping-cart', {useNewUrlParser : true }, (error)=>{
  if(error){
    console.log(error)
  }else{
    console.log('connecting to DB... .....')
  }
  
})

const products = [ new Product({

    imagePath: '/images/Huawei Y5 Lite.jpg',

    productName: 'Huawei Y5 Lite',

    information: {

        storageCapacity: 16,
        numberOfSIM: ' Dual Sim',
        memoryRAM: 1,
        color: 'blue',
    },

    price: 1299,

}),

new Product({

    imagePath: '/images/Samsung Galaxy A10s.jpg',

    productName: 'Samsung Galaxy A10s  Y5 Lite ',

    information: {

        storageCapacity: 32,
        numberOfSIM: ' Dual Sim',
        memoryRAM: 2,
        color: 'Red',
    },
    price: 1699,

}),

 new Product({

        imagePath: '/images/Huawei Y6 Prime.jpg',
        productName: 'Huawei Y6 Prime ',

        information: {

            storageCapacity: 32,
            numberOfSIM: ' Dual Sim',
            memoryRAM: 2,
            color: 'Amber Brown',
        },
        price: 1906 ,

    }), 

new Product({

    imagePath:'/images/PinePhone-600x600.png',

    productName: 'Nokia 3 Dual ',

    information: {

        storageCapacity: 16,
        numberOfSIM: ' Dual Sim',
        memoryRAM: 2,
        color: 'Tempered Blue',
    },
    price: 1222 ,

}),
new Product({

    imagePath: '/images/Xiaomi Redmi 8A.jpg',

    productName: 'Xiaomi Redmi 8A ',

    information: {

        storageCapacity: 32,
        numberOfSIM: ' Dual Sim',
        memoryRAM: 2,
        color: ' Midnight Black ',
    } ,
    price: 1777 ,

}),
new Product({

    imagePath: '/images/Infinix Hot 8.jpg',

    productName: 'Infinix Hot 8',

    information: {

        storageCapacity:32,
        numberOfSIM: ' Dual Sim',
        memoryRAM: 3,
        color: 'Quetzal Cyan',
    } ,
    price: 1745 ,

}),


]

var done = 0;
for (var index = 0; index < products.length ; index++) {
   products[index].save((error , doc)=>{
       if(error){
           console.log(error) 
       }
       console.log(doc)
       done ++
       if (done === products.length){
        mongoose.disconnect();
       }
   })  
}
