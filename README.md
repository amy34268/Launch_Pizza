# Launch_Pizza

**Backend Prompt:** 
You are a business owner at Launch-Pizza. One day you decide to open your store to online purchases. The basic functionality must allow any customer to order a pizza from a set menu, track the order status of the pizza, and be able to see a receipt for their order for up to one year. Describe and give examples of a basic API and its endpoints that will accomplish this task. You do not need to extensively document this API.

<h3>User Stories:</h3> 
<ul>
<li>As a user, I want to order a pizza from a set menu. </li>
<li>As a user, I want to  track the order status of the pizza. </li>
<li>As a user, I want to be able to see a receipt for their order for up to one year.</li>
</ul>

The backend of this Launchi-Pizza ordering service will be implemented using  <strong>NodeJS and Express framework  </strong>. Users will be able to perform  <strong>CRUD (create, read, update, delete) </strong>operations to make online-purchases, so we have  <strong> Rest API endpoints  </strong> defined in order to handle these HTTP requests.


<h2> UI Prototype on Figma </h2> 
<img src="https://github.com/amy34268/Launch_Pizza/blob/main/Pizza%20UI.png">
When the website is initially loaded, a <strong>GET request</strong> is sent to the backend to retrieve a list of pizzas (from ideally a database such as MongoDB since datas will be persistent)  to display on the top of the website. 

As an example: 

(backend routes)

```
/* app.js*/

// get a list of pizzas
app.get('/Pizzas/', async(req, res) => {
	try{	
	    const pizzas = await pizza.getPizzas();
	    res.json(pizzas);
	}catch(catch){
 	    // error: internal service error 
	    res.statusCode = 500;
	    res.json({});
	}
}
```

```
/* pizza.js*/

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
```
Similarly, if the user has a list of past orders (none atm as shown on the prototype), we would fetch a <strong> GET </strong> request, and exepct a <strong> 200 OK </strong>, when the response is succesfully returned.

```
/* app.js*/

// get a list of orders
app.get('/Orders', async(req, res) => {
	try{	
	    const orders = await orders.getAllOrders();
	    res.json(orders);
	}catch(error){
 	    // error: internal service error 
	    res.statusCode = 500;
	    res.json({});
	}
}

```

```
/* orders.js*/

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
``` 


<h2> Story 1: As a user, I want to order a pizza from a set menu. </h2> 
Users will be able to view a list of pizza, click on the Add button to order a specific pizza, which will make a <strong>POST request with Axios in React</strong>, and send the data (the <strong>pizza.id</strong> of the pizza picked, and a receipt for that order) to the backend endpoint. 

<strong> (endpoint) </strong>

```	
/*app.js*/

// Add a order (that has a chosen pizza's id and a receipt) to the the list of orders
app.post('/Orders', async(req, res) => {
    try {
        const orders = await orders.add(req.params.pizzaId, req.params.receipt);
        res.statusCode = orders.code;
        res.json(orders);
    } catch (error) {
        res.statusCode = 500;
        res.json({});
    }
});
```

```
/*orders.js*/

orders.add = async (pizzaId, receipt) => {
  return new Promise(async (resolve, reject) => {
    try {
      orderId = new mongoose.Types.ObjectId().toString();
      await db.orders.insertOne(
	    {id: orderId, pizzaId: pizzaId, receipt: receipt}
      ); 
      // status code 201: The request has been fulfilled and has resulted in one or more new resources being created. 
      resolve({code: 201, orders: order});
    } catch (e) {
      reject({ code: e.code || "DB Error" });
    }
  });
};
```

<h2>Story 2: As a user, I want to  track the order status of the pizza.</h2>

I have defined the order <strong> Status</strong> to be of the following: 
<ul> 
  <li>baking</li>
  <li>ready for pickup</li>
  <li> order completed </li>
</ul>
Therefore, we should <strong>add a new field: status</strong> to our <strong> order Schema </strong>, now the schema should look like this: 

```
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
```
As the order status is now <strong> a field of order </strong>, tracking it is essentially making a <strong> GET request </strong> to retrieve a specific order. When the user cliks on the order to view its details, the <strong> order.id </strong> will be passed as a request param, which we will use to fetch the speciic order in database. Once succesfullly returned, user will able to see the status label attach to a specific order. 


```
/* app.js*/

// get a specific order based on id to show user the order's status 
app.get('/Order/:id', async(req, res) => {
	try{	
	    const order = await orders.getOrderStatus(req.orderId);
	    res.json(order);
	}catch(error){
 	    // error: internal service error 
	    res.statusCode = 500;
	    res.json({});
	}
}

```

```
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

```
	

<h2> Story 3: As a user, I want to be able to see a <strong> receipt </strong> for their order for <strong> up to one year </strong>. </h2>
Users will be able to view a list of their past orders, as <strong> receipt is a field of orders</strong>, essentially we are makign a  <strong>GET request</strong> for all the receipts <strong> but only up to one year </strong>, this flitering can be done by the database (MongoDB) by passing in <strong> today's date </strong> and let the db return only the orders within this specified time period.


```
/* app.js*/

/* Get a list of orders (receipt) up to one year*/
app.get('/Orders/InOneYear', async(req, res) => {
    try {
        const orders = await orders.getOrdersInOneYear();
        res.statusCode = orders.code;
        res.json(orders);
    } catch (error) {
        res.statusCode = 500;
        res.json({});
    }
})
```

```
/* order.js*/

order.getOrdersInOneYear = async() => {
	//  Create a date object for today's date
	//  will appear as: Sun Sep 18 2022 23:04:56 GMT-0700 (Pacific Daylight Time)
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
```

