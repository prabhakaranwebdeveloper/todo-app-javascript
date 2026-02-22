// config/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "429201",
 database: "todo_app"
});

db.connect(err=>{
 if(err) throw err;
 console.log("MySQL Connected ✅");
});

module.exports = db;