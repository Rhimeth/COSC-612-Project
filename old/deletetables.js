/*
This file will delete the tables so they can be refreshed
*/

import fs from 'fs'; // File I/O
import path from 'path'; // Allows working with paths
import pool from './backend/db.js'; // Importing pool from db.js
import fileURLtoPath, { fileURLToPath } from 'url'; // Some stupid shit you need to get path to work
// because ES modules don't inherently support working with paths

// __ because its considered global
const dirname = path.dirname(fileURLToPath(import.meta.url));

const schema = fs.readFileSync(path.join(dirname, '/backend/deletealltables.sql'), ('utf-8'));


// Create tables using the DATABASE_URL, which is on railway.app (website)
pool.query(schema, (err, red) => {
    if (err) throw err;
    console.log('TABLES WERE DELETED.');
    process.exit();
})
