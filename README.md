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
When the website is initially loaded, a <strong>GET request</strong> is sent to the backend to retrieve a list of pizzas (from ideally a database such as MongoDB)  to display on the top of the website. (And a list of orders in similar logic, but there is none at the moment as shown on the prototype)

As an example: 

(backend routes)

```
/* app.js*/
// get a list of pizzs
app.get('/Pizzas/', async(req, res) => {
	try{	
    const pizzas = await orders.getPizzas();
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
<h2> Story 1: As a user, I want to order a pizza from a set menu. </h2> 
Users will be able to view a list of pizza, click on the Add button to order a specific pizza, which will make a <strong>POST request with Axios in React</strong>, and send the data (the <strong>id</strong> of the pizza picked, and a receipt for that order) to the backend endpoint. 

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
	

<h2> Story 3: As a user, I want to be able to see a <strong> receipt </strong> for their order for <strong> up to one year </strong>. </h2>

Add Schema (receipt inside order) 
Up to one year constraint 

```
/* app.js*/
// get a list of order (ALL of them) 
app.get('/Orders/', async(req, res) => {
	try{	
    const orders = await orders.getOrders();
    res.json(orders);
	}catch(catch){
 	// error: internal service error 
    res.statusCode = 500;
    res.json({});
}
}
```

```
/* order.js*/
order.getOrders = async() => {
  return new Promise(async(resolve,reject) => {
       try{
           await db.connect();
           const allOrders= await db.order.find({});
           // status code 200: OK            
           resolve({code: 200, results: allOrders});
       } catch (e) {
          reject({ code: e.code || "DB Error" });
       }
   })
}
```
// error codes
