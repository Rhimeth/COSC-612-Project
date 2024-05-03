/*
READ ME
Change DATABASE_URL_CLOUD to DATABASE_URL_LOCAL if you want to make database locally with PostgreSQL
*/

import dotenv from "dotenv"; // load env variables from .env
import pg from "pg"; // PostgreSQL module

dotenv.config({ path: "../../.env" });
const { Pool } = pg;

//TODO I suppressed a warning that seems to be a false positive
// eslint-disable-next-line no-undef
console.log(process.env.DATABASE_URL_CLOUD);
// eslint-disable-next-line no-undef
const pool = new Pool({ connectionString: process.env.DATABASE_URL_CLOUD });

export default pool; // Allows the pool to be used outside this file as
