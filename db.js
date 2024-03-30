/*
READ ME
Change DATABASE_URL_CLOUD to DATABASE_URL_LOCAL if you want to make database locally with PostgreSQL
*/

import dotenv from "dotenv"; // load env variables from .env
import pg from "pg"; // PostgreSQL module

dotenv.config();
const { Pool } = pg;

console.log(process.env.DATABASE_URL_CLOUD);
const pool = new Pool({ connectionString: process.env.DATABASE_URL_CLOUD});

export default pool; // Allows the pool to be used outside this file as

