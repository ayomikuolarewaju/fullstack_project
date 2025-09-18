import {Client} from "pg"
import dotenv from "dotenv"
dotenv.config()

const con = new Client({
    host:process.env.HOST,
    user:process.env.USER,
    port:process.env.PORT,
    database:process.env.DATABASE,
    password:process.env.PASSWORD
})

// Initialize database connection
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await con.connect();
    isConnected = true;
    console.log("✅ Connected to PostgreSQL database");
    
    // Create tables if they don't exist
    await createTables();
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await con.end();
  isConnected = false;
  console.log("✅ Database connection closed");
};

const createTables = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INTEGER CHECK (age > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await con.query(query);
    console.log("✅ Users table ready");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
    throw err;
  }
};


export default con



