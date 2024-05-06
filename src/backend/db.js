/*
READ ME
Change DATABASE_URL_CLOUD to DATABASE_URL_LOCAL if you want to make database locally with PostgreSQL
*/

import dotenv from 'dotenv';
import pg from 'pg';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: `${__dirname}/../../../.env` });

const { Pool } = pg;

console.log(process.env.DATABASE_URL_CLOUD);
const pool = new Pool({ connectionString: process.env.DATABASE_URL_CLOUD });

export default pool; // Allows the pool to be used outside this file as
