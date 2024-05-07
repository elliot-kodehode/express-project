import {orderSchema, productSchema, userSchema} from "../schema/schema.mjs";
import {ReqError} from "./errorHandler.mjs";

const dataValidator = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body)
    
    if (error) {
        const errorMsg = error.details[0].message
        throw new ReqError(400, errorMsg)
    } else {
        next()
    }
}

const validateUserData = dataValidator(userSchema)
const validateProductData = dataValidator(productSchema)

const validateOrderData = dataValidator(orderSchema)

export { 
    validateUserData, 
    validateProductData,
    validateOrderData
}