﻿import express from "express";
import {join} from 'path';
import eventLogger from "./middleware/eventLogger.mjs";

import productsRoute from "./api/products.mjs";
import ordersRoute from "./api/orders.mjs";
import signupRoute from "./api/signup.mjs";
import loginRoute from "./api/login.mjs";
import {errorHandler, ReqError } from "./middleware/errorHandler.mjs";

const { dirname } = import.meta

// initialize express
const app = express()

// Establish server port
const port = process.env.PORT || 3000;



//middleware
// app.use(express.json());

// req is post, put, get etc.
// res is response, send something back

// Custom request logger middleware
app.use(eventLogger);

// Built in middleware to parse JSON data in request bodies.
app.use(express.json())

// Built in middleware to serve static files
app.use(express.static("public"));

// Api routes. Uses external routers.
app.use("/api/products", productsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);

//404 catcher. Catches any request not picked up by our route handlers.
app.all("*", (req, res, next) => {
    throw new ReqError(404, "Not Found")
})

// errorHandler returns error in json format.
app.use(errorHandler);

// Server startup
app.listen(port,  () => {
    console.log(`Server running at http://localhost:${port}`);
})