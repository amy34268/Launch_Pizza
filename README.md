# Launch_Pizza

**Backend Prompt:** 
You are a business owner at Launch-Pizza. One day you decide to open your store to online purchases. The basic functionality must allow any customer to order a pizza from a set menu, track the order status of the pizza, and be able to see a receipt for their order for up to one year. Describe and give examples of a basic API and its endpoints that will accomplish this task. You do not need to extensively document this API.

<h3>User Stories:</h3> 
<ul>
<li>As a user, I want to order a pizza from a set menu. </li>
<li>As a user, I want to  track the order status of the pizza. </li>
<li>As a user, I want to be able to see a receipt for their order for up to one year.</li>
</ul>

The backend of this Launchi-Pizza ordering service will be implemented using NodeJS and Express framework. Users will be able to perform CRUD (create, read, update, delete) operations to make online-purchases, so we have Rest API endpoints defined in order to handle these HTTP requests.


<h2> UI Prototype on Figma </h2> 

When the website is initially loaded, a **GET request** is sent to the backend to retrieve a list of pizzas (from ideally a database such as MongoDB)  to display on the top of the website.

As an example: 

(backend routes)

```
/* app.js*/
// get list of order 
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
order.getAll = async() => {
  return new Promise(async(resolve,reject) => {
       try{
           await db.connect();
           const allOrders= await db.order.find({});
           // status: OK            
           resolve({code: 200, results: allOrders});
       } catch (e) {
          // error: internal service error?          
          reject({code: 500, error: e});
       }
   })
}
```
<h4> Story 1: As a user, I want to  order a pizza from a set menu. </h4> 
Users will be able to view a list of pizza, click on the Add button to order, which will make a <strong>POST request with Axios in React</strong>, and send the data (the <strong>id</strong> of the pizza picked) to the backend endpoint. 
