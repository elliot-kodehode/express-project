import express from 'express';
const router = express.Router();
import { ReqError } from "../middleware/errorHandler.mjs";
import {
    getProducts,
    getCategory,
    getSingleProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    deleteOrder, getSingleOrder
} from "../database/dbQueries.mjs";
import jwtValidator from "../middleware/jwtValidator.mjs";


router.get("/", (req, res) => {
    const { category } = req.query
    let data;
    

    if (category) {
        data = getCategory(category.toLowerCase())
    } else {
        data = getProducts()
    }

    res.status(200).json({
        data: data,
    })
})

router.post("/", (req, res) => {
    addProduct(req.body)

    res.status(201).json({
        message: "Product has been created!",
        addedProduct: req.body
    });
})

router.all('/', (req, res, next) => {
    next(
        new ReqError(
            405, 
            "Unsupported request method. Please refer to the API documentation"
        )
    );
});

router.get("/:id", (req, res) => {
    const { id } = req.params
    const data = getSingleProduct(id)

    if (data === null) throw new ReqError(404,"Product not found.")

    res.status(201).json({
        data: data
    });
})

router.delete("/:id", (req, res) => {
    const { id } = req.params
    const data = getSingleProduct(id);
    
    if (data === null) throw new ReqError(404,"Product not found.")
    
    deleteProduct(id)
    res.status(200).json({
        message: "Deleted product " + id
    });
})

router.put("/:id", (req, res) => {
    const { id } = req.params
    const checkProduct = getSingleProduct(id)
    
    if (checkProduct === null) throw new ReqError(404,"Product not found.")
    
    updateProduct(req.body);
    res.status(200).json({
        message: "Successfully updated product", 
        data:{
            oldVersion: checkProduct, 
            newVersion: req.body
        }
    });
})

router.all("/:id", (req, res, next) => {
    next(
        new ReqError(
            405,
            "Unsupported request method. Please refer to the API documentation"
        )
    );
})


export default router;