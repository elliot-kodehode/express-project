import express from "express";
import {
    addOrder,
    deleteOrder,
    getOrders,
    getSingleOrder,
} from "../database/dbQueries.mjs";
import {ReqError} from "../middleware/errorHandler.mjs";
import jwtValidator from "../middleware/jwtValidator.mjs";
import {validateOrderData} from "../middleware/dataValidator.mjs";
const router = express.Router();


router.get("/", (req, res) => {
    const data = getOrders()

    res.status(200).json({
        data: data,
        message: "Retrieved list of orders",
    });
})

router.post("/", jwtValidator, validateOrderData, (req, res) => {
    addOrder(req.body)

    res.status(201).json({
        message: "Order added.",
        addedOrder: req.body
    });
})


router.all("/", (req, res) => {
    throw new ReqError(
            405,
            "Unsupported request method. Please refer to the API documentation"
        )
})

router.get("/:orderId", (req, res) => {
    const { orderId } = req.params;
    const data = getSingleOrder(orderId)

    if (data === null) throw new ReqError(404,"Order not found.")

    res.status(200).json({
        data: data,
        message: "Order retrieved."
    });
})

router.delete("/:orderId", jwtValidator, (req, res) => {
    const { orderId } = req.params
    const data = getSingleOrder(orderId);

    if (data === null) throw new ReqError(404,"Order not found.")
    
    deleteOrder(orderId)
    res.status(200).json({
        message: "Deleted order " + orderId
    });
})

router.all("/:orderId", (req, res, next) => {
    next(
        new ReqError(
            405,
            "Unsupported request method. Please refer to the API documentation"
        )
    );  
})

export default router;

