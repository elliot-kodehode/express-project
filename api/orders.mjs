import express from "express";
const router = express.Router();

router.all("/", (req, res) => {
    
    if (req.method === "GET") {
        res.status(200).json({
            message: "Orders will come here",
        });
    } else if (req.method === "POST") {
        res.status(201).json({
            message: "Use this to add new orders."
        });
    }
    const error = new Error(`${req.method} is not a valid method`);
    error.status = 405;
    throw error;
})

router.all("/:orderId", (req, res) => {
    const orderId = req.params;
    
    if (req.method === "GET") {
        res.status(200).json({
            message: "Order information",
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

