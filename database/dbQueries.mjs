import sqlite3 from "better-sqlite3";
import { join } from   "path";
import fs from "fs";
import * as constants from "node:constants";
import products from "../api/products.mjs";

const { dirname } = import.meta;

const db = new sqlite3(join(dirname, "..", "database", "store.sqlite"));

// Queries for /products

const getProducts = () => db.prepare("SELECT * FROM products").all()

const getCategory = (category) => db.prepare(
    "SELECT * FROM products WHERE LOWER(category) = ?").all(category);

// Single Product

const getSingleProduct = (id) => db.prepare("SELECT * FROM products WHERE id = ?").get(id);

// Add a product

const addProduct = ({ name, category, stock, price, filePath }) => {
    const imageFile = fs.readFileSync(filePath)
    db.prepare("INSERT INTO products (name, category, stock, price, image_data, image_type) VALUES (?, ?, ?, ?, ?, ?)").run(name, category, stock, price, imageFile, 'image/jpeg')
}

const deleteProduct = (id) => db.prepare("DELETE FROM products WHERE id = ?").run(id)

const updateProduct = ({name, category, stock, id}) => db.prepare(
    "UPDATE products SET name = ?, category = ?, stock = ? WHERE id = ?").run(name, category, stock, id)

//
//
// USERS 

const signupUser = (email, password) => db.prepare(
    "INSERT INTO users (email, password) VALUES(?,?)").run(email, password)

const loginUser = (email) => {
    const loginUserQuery = db.prepare("SELECT * FROM users WHERE email = ?")
    return loginUserQuery.get(email)
}

//
//
// Orders

const getOrders = () => db.prepare("SELECT * FROM orders").all()

const getSingleOrder = (order_id, product_id) => {
    db.prepare("SELECT * FROM order_products WHERE id = ?").get(order_id)
    const productName = db.prepare("SELECT name FROM products WHERE id = ?").get(product_id)
    
}
const addOrder = ({ user_id, count, order_date, order_items }) => {
    const result = db.prepare("INSERT INTO orders (user_id, count, order_date) VALUES (?, ?, ?)").run(user_id, count, order_date);

    const order_id = db.prepare("SELECT last_insert_rowid() as lastId").get().lastId;
    console.log(order_id)
    
    addOrderProduct({ order_id, order_items })
}


const addOrderProduct = ({ order_id, order_items }) => {
    
    order_items.forEach(item => {
    const {product_id, quantity} = item
    db.prepare("INSERT INTO order_products (order_id, product_id, quantity) VALUES (?, ?, ?)").run(order_id, product_id, quantity)
    }
    )
}


export { 
    getProducts, 
    getCategory, 
    getSingleProduct, 
    addProduct, 
    deleteProduct, 
    updateProduct, 
    signupUser,
    loginUser,
    addOrder,
    addOrderProduct
};