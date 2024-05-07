import Joi from "joi";  
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore)

const userSchema = Joi.object({
    email: Joi.string().email().required(), 
    password: joiPassword
        .string()
        .minOfSpecialCharacters(2)
        .minOfLowercase(2).minOfUppercase(2)
        .minOfNumeric(2)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .doesNotInclude(["password", "1234", "abcd"])
})

const productSchema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    category: Joi.string().min(3).max(50).required(),
    stock: Joi.number().integer().min(0).max(10000).required(),
    price: Joi.number().min(0).precision(2).prefs({convert: false}).required()
    
})

const orderSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    order_items: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().required(),
            quantity: Joi.number().integer().min(1).required()
        })
    )
})

export { userSchema, productSchema, orderSchema }