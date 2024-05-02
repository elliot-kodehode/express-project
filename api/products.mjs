import express from 'express';
const router = express.Router();
import { ReqError } from "../middleware/errorHandler.mjs";
import { getProducts, getCategory, getSingleProduct, addProduct, deleteProduct, updateProduct } from "../database/dbQueries.mjs";
import jwtValidator from "../middleware/jwtValidator.mjs";


router.get("/", (res, req) => {
    const { category } = req.query;
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

router.post("/", jwtValidator, (req, res) => {
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

router.all("/:id", (req, res) => {
        const { id } = req.params;
        let message, data;
        
    if (req.method === "GET") {
        data = getSingleProduct(id)
        
        if (data) {
            message = "Successfully fetched data for product"
        } else {
            throw new ReqError(404, "Product not found")
        }
        
    } else if (req.method === "DELETE") {
       data = getSingleProduct(id);
       
       if (data) {
           deleteProduct(id)
           message = "Deleted product" + id
       } else {
           message = "Product not found"
       }
        
    } else if (req.method === "PUT") {
        const checkProduct = getSingleProduct(id)
        
        if (checkProduct) {
            updateProduct(req.body);
            message = "Successfully updated product"
        data = {
            oldVersion: checkProduct,
            newVersion: req.body
            }
        } else {
            throw new ReqError(404, "Product not found")
        }
        
    } else {
        throw new ReqError(500, "Not valid method")
    }
    res.status(200).json({
        id: id, 
        message: message, 
        data: data
    })
})


export default router;