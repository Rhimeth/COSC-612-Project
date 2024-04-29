/*
This file will create the SQL tables in the cloud. The pool establishes a connection.
Then the schema gets sent and created on the server, railway in this case.
*/

import fs from 'fs'; // File I/O
import path from 'path'; // Allows working with paths
import pool from './db.js'; // Importing pool from db.js
import fileURLtoPath, { fileURLToPath } from 'url'; // Some stupid shit you need to get path to work
// because ES modules don't inherently support working with paths

// __ because its considered global
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), ('utf-8'));


// Create tables using the DATABASE_URL, which is on railway.app (website)
pool.query(schema, (err, red) => {
    if (err) throw err;
    console.log('Tables were created.');
    process.exit();
})
