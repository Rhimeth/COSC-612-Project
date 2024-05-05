/*
READ ME
Change DATABASE_URL_CLOUD to DATABASE_URL_LOCAL if you want to make database locally with PostgreSQL
*/

import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, '../../../');
const envPath = path.resolve(BASE_DIR, '.env');
dotenv.config({ path: envPath });


const { Pool } = pg;

//TODO I suppressed a warning that seems to be a false positive
// eslint-disable-next-line no-undef
console.log(process.env.DATABASE_URL_CLOUD);
// eslint-disable-next-line no-undef
const pool = new Pool({ connectionString: process.env.DATABASE_URL_CLOUD });

export default pool; // Allows the pool to be used outside this file as
