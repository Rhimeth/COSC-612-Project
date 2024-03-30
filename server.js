/*
Express.js is used for the backend server. Express allegedly just
reduces boilerplate that you'd otherwise need if you wrote it all
inside of node.js instead

The server is currently listening on port 3000

It can be changed to be hosted in the cloud if need be.
*/

import express from 'express'; // Express
const app = express();

// Listen on port 3000, which is used on most web development servers
const port = process.env.PORT || 3000;

// Route GET requests
app.get('/', (req, res) => {
    res.send('This is response to your GET request.')
})

// Starts the server on port 3000
console.log('Starting the server...');
app.listen(port, () => {
    console.log('Server currently running on port: ' + port);
})