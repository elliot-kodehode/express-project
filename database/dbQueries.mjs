import sqlite3 from "better-sqlite3";
import {join} from "path";
import fs from "fs";

const { dirname } = import.meta;

const db = new sqlite3(join(dirname, "..", "database", "store.sqlite"));

// Queries for /products

const getProducts = () => db.prepare("SELECT * FROM products").all()

const getCategory = (category) => db.prepare(
    "SELECT * FROM products WHERE LOWER(category) = ?").all(category);

// Single Product

const getSingleProduct = (id) => db.prepare("SELECT * FROM products WHERE id = ?").get(id);

// Add a product

const addProduct = ({ name, category, stock, price }) => {
    db.prepare("INSERT INTO products (name, category, stock, price) VALUES (?, ?, ?, ?)").run(name, category, stock, price)
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

const getSingleOrder = (order_id) => {
    // o is orders, op is order_products, p is products
    const singleOrderQuery = 'SELECT o.id, o.user_id, o.count, p.name, p.category, op.quantity FROM orders AS o JOIN order_products AS op ON o.id = op.order_id JOIN products AS p ON op.product_id = p.id WHERE o.id = ?'
    const orderItems = db.prepare(singleOrderQuery).all(order_id)
    
    if (orderItems.length === 0) {
        return null
    }
    
    const { user_id, count } = orderItems[0];
    return {
                user_id: user_id,
                order_id: order_id,
                count: count,
                order_items: orderItems.map(item => ({
                    name: item.name,
                    product_id: item.product_id,
                    category: item.category,
                    quantity: item.quantity,
                }))
            };
}

const addOrder = ({ user_id, order_items }) => {
    
    // sum of all the products*quantity for the order
    let totalProducts = 0;
    order_items.forEach(item => {
        totalProducts += item.quantity;
    })
    
    const result = db.prepare("INSERT INTO orders (user_id, count, order_date) VALUES (?, ?, CURRENT_DATE)")
        .run(user_id, totalProducts);
    const order_id = db.prepare('SELECT last_insert_rowid() as lastId').get().lastId;
    
    addOrderProduct({ order_id, order_items })
}


const addOrderProduct = ({ order_id, order_items }) => {
    
    order_items.forEach(item => {
    const {product_id, quantity} = item
    db.prepare("INSERT INTO order_products (order_id, product_id, quantity) VALUES (?, ?, ?)")
        .run(order_id, product_id, quantity)
    }
    )
}

const deleteOrder = (id) => {
    // Delete from order_products first since order_id is foreign key from orders
    // Do it in two separate queries because sqlite cant do both in one
    
    db.prepare(
        "DELETE FROM order_products WHERE order_id = ?").run(id)
    db.prepare(
        "DELETE FROM orders WHERE id = ?").run(id)
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
    addOrderProduct,
    getSingleOrder,
    getOrders,
    deleteOrder
};