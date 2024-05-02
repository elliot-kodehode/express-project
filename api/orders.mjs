import express from "express";
import {addOrder, addProduct} from "../database/dbQueries.mjs";
const router = express.Router();

router.all("/", (req, res) => {
    
    if (req.method === "GET") {
        res.status(200).json({
            message: "Orders will come here",
        });
        
        
    } else if (req.method === "POST") {
        const orderId = req.params;
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
    const orderId = req.params;
    
    if (req.method === "GET") {
        addOrder(req.body)

        res.status(201).json({
            message: "Product has been created!",
            addedProduct: req.body
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

