const sqlite3 = require('sqlite3').verbose();

const filePath = "./products.db";

// Connect to the SQLite database
const db = new sqlite3.Database(filePath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        db.close()
    } else {
        console.log("Connected to the SQLite database file");
    }
});


module.exports = { db };