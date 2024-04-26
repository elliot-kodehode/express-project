import express from 'express';
const router = express.Router();
import {ReqError} from "../util/errorHandler.mjs";

import sqlite3 from 'sqlite3';

import db from './connection.js';

router.all('/', (req, res) => {
    
    if (req.method === "GET") {
        let data = db

    }
    
    if (req.method === "GET") {
        let data = products
        const { category } = req.query

        if (category) {
            data = products.filter(products => products.category.toLowerCase() === category.toLowerCase())
        }
    res.json({
        data
    });

    } else if (req.method === "POST") {
        res.status(201).json({
            message: "Product has been created!"
        });
    }
    throw new ReqError(500, "Not valid method")
});

router.all("/:productId", (req, res) => {
        const {productId} = req.params;
        
    if (req.method === "GET") {
        res.status(200).json({
            productId: productId,
            message: `Product ${productId} will come here.`
        })
    } else if (req.method === "DELETE") {
        res.status(200).json({
            productId: productId,
            message: `This will delete product ${productId}.`
        })
    } else if (req.method === "PUT") {
        res.status(200).json({
            productId: productId,
            message: `This will update product ${productId}.`
        })
    } else {
        throw new ReqError(500, "Not valid method")
    }
})


export default router;