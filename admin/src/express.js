`use strict`;
const express = require("express");
const EXPRESS_SERVER = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require("compression"); // server response compression
const globalErrorHandler = require("./controllers/error-controller.js");


// LOAD THE ROUTES
const productsRouter = require("./routes/product-routes.ts");


// APPEND THE APP BASE DIR. TO THE GLOBAL OBJ.
global.__approotdir = __dirname;


// * HEALTH CHECK ENDPOINTS
EXPRESS_SERVER.get("/status", (req, res) => {
	res.status(200).end();
});
EXPRESS_SERVER.head("/status", (req, res) => {
	res.status(200).end();
});


// GLOBAL 3RD PARTY M-WARE >

// SET SECURITY HTTP HEADERS
EXPRESS_SERVER.use(helmet());

// DATA SANITIZATION AGAINST MALICIOUS NoSQL QUERY-INJECTION
// removes '$' from req.body, req.params and/or req. query string
// prevents this attack => "email": {"$gt": ""}
EXPRESS_SERVER.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
// filters out HTML tags & prevents malicious HTML from executing JS 
EXPRESS_SERVER.use(xss());

// SERVER RESPONSE COMPRESSION MIDDLEWARE FOR ALL TEXT SENT TO CLIENTS
EXPRESS_SERVER.use(compression());

// parse JSON data from the request body into req.body
EXPRESS_SERVER.use(express.json());


// CUSTOM M-WARE > 

// ADD A CUSTOM PROPERTY ('requestTime) TO THE REQUEST OBJ.
EXPRESS_SERVER.use((request, response, next) => {

	request.requestTime = new Date().toISOString();

	console.log(request.headers);

	// console.log(JSON.stringify(request.cookies));

	next();
});


EXPRESS_SERVER.use(
   cors({
      origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"],
   })
);


// MOUNT THE ROUTES
EXPRESS_SERVER.use("/", productsRouter);


// GLOBAL ERROR HANDLING M.WARE
EXPRESS_SERVER.use(globalErrorHandler);


module.exports = EXPRESS_SERVER;