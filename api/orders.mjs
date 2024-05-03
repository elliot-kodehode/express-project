import express from "express";
import {addOrder, getOrders, getSingleOrder} from "../database/dbQueries.mjs";
import {ReqError} from "../middleware/errorHandler.mjs";
const router = express.Router();

router.all("/", (req, res) => {
    
    if (req.method === "GET") {
        const data = getOrders()
        
        res.status(200).json({
            data: data,
            message: "Retrieved list of orders",
        });
        
        
    } else if (req.method === "POST") {
        addOrder(req.body)
        
        res.status(201).json({
            message: "Order added."
        });
    }
    const error = new Error(`${req.method} is not a valid method`);
    error.status = 405;
    throw error;
})

router.all("/:orderId", (req, res) => {
    const { orderId } = req.params;
    
    if (req.method === "GET") {
        const data = getSingleOrder(orderId)
        
        if (data === null) throw new ReqError(404,"Order not found.")

        res.status(201).json({
            data: data, 
            message: "Order retrieved."
        });
        
    } else if (req.method === "DELETE") {
        res.status(200).json({
            message: "Delete this order."
        });
    }
    const error = new Error(`${req.method} is not a valid method`);
    error.status = 405;
    throw error;
})

export default router;

