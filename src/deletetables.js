/* eslint-disable no-undef */
/*
This file will delete the tables so they can be refreshed
*/

import fs from 'fs' // File I/O
import path from 'path' // Allows working with paths
import pool from './backend/db.js' // Importing pool from db.js
import fileURLToPath from 'url' // Some stupid shit you need to get path to work
// because ES modules don't inherently support working with paths

const dirname = path.dirname(fileURLToPath(import.meta.url))

const schema = fs.readFileSync(path.join(dirname, '/backend/deletealltables.sql'), ('utf-8'))


// Create tables using the DATABASE_URL, which is on railway.app (website)
pool.query(schema, (error) => {
    if (error) throw error
    console.log('TABLES WERE DELETED.')
    process.exit()
})
