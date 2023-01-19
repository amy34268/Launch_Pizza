/*orders.js*/

const mongoose = require('mongoose');
/* not set up */
const db = require('../db/db.config');


/* order Schema */
const orderSchema = {
    _id: {
        type: ObjectId,
        required: true
    },
    pizzaId: {
        type: String,
        required: true
    },
    reciept: {
        type: Object,
        required: true
    },
    order: {
        type: String,
        required: true
    }
}


orders.add = async (pizzaId, receipt) => {
    return new Promise(async (resolve, reject) => {
      try {
        orderId = new mongoose.Types.ObjectId().toString();
        const newOrder = await db.orders.insertOne(
          {id: orderId, pizzaId: pizzaId, receipt: receipt}
        ); 
        // status code 201: The request has been fulfilled and has resulted in one or more new resources being created. 
        resolve({code: 201, results: newOrder});
      } catch (e) {
        reject({ code: e.code || "DB Error" });
      }
    });
  };

/* order.js*/
orders.getOrderStatus = async(orderId) => {
    return new Promise(async(resolve,reject) => {
         try{
             const order = await db.order.find({id: orderId});
             // status: OK            
             resolve({code: 200, results: order});
         } catch (e) {         
            reject({code: 500, error: e});
         }
     })
  }


orders.getAllOrders = async() => {
    return new Promise(async(resolve,reject) => {
         try{
             const orders = await db.order.find({});
             // status: OK            
             resolve({code: 200, results: orders});
         } catch (e) {         
            reject({code: 500, error: e});
         }
     })
  }

  orders.getOrdersInOneYear = async() => {
	//  Create a date object for today's date
	//  will appear as: Wed Jan 18 2023 23:04:56 GMT-0700 (Pacific Daylight Time)
	  let date = new Date(); 
	//  We could subtract one year from today's date like this according to https://www.techwalla.com/articles/how-to-subtract-one-year-from-a-date-in-javascript
	  const oneYearAgo = date.setMonth(date.getMonth() – 12);
  return new Promise(async(resolve,reject) => {
       try{
	   // Here we are asking for all orders that are created AFTER a year ago
           const allOrders = await db.order.find({"createdAt" : { $gte : oneYearAgo }});
           // status code 200: OK            
           resolve({code: 200, results: allOrders});
       } catch (e) {
          reject({ code: e.code || "DB Error" });
       }
   })
}