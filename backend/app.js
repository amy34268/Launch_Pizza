var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const pizza = require('./routes/pizza');
const orders = require('./routes/pizza');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



db.connectToServer(function (err) {
    if (err) {
      console.error(err);
      process.exit();
    }
});

// get a list of pizzas
app.get('/Pizzas/', async(req, res) => {
	try{	
	    const pizzas = await pizza.getPizzas();
	    res.json(pizzas);
	}catch(error){
 	    // error: internal service error 
	    res.statusCode = 500;
	    res.json({});
    }
});


// Create a order with pizzaId and receipt passed from request params to the the list of orders
app.post('/Order', async(req, res) => {
    try {
        const order = await orders.add(req.params.pizzaId, req.params.receipt);
        res.statusCode = orders.code;
        res.json(order);
    } catch (error) {
        res.statusCode = 500;
        res.json({});
    }
});

// get a specic order's id in order to show user order status 
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


module.exports = app;
