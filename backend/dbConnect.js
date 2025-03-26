import pgPkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {Pool}=pgPkg;
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    database: process.env.DB
})

pool.connect().then(() => {
    console.log("Connected to Postgres Database")
}).catch((err) => {
    console.log("Error connecting to the database:", err)
})

export default pool;