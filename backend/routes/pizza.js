/* pizza.js*/
const mongoose = require('mongoose');


const pizza = {};

pizza.getPizzas = async() => {
    return new Promise(async(resolve,reject) => {
         try{
             const allPizzas= await db.pizzas.find({});
             // status: OK            
             resolve({code: 200, results: allPizzas});
         } catch (e) {
            // error: internal service error?          
            reject({code: 500, error: e});
         }
     })
  }

module.exports = router;