/*
# Citation for the following page:
# Date: 05/20/2025
# Copied from /OR/ Adapted from /OR/ Based on: Exploration - Web Application Technology, npmjs
# Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-web-application-technology-2?module_item_id=25352948
https://www.npmjs.com/package/dotenv 
             
*/



// Get an instance of mysql we can use in the app
require('dotenv').config({path: '../.env'});
let mysql = require('mysql2')

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit   : 10,
    host              : 'classmysql.engr.oregonstate.edu',
    user              : process.env.DB_USER,
    password          : process.env.DB_PASSWORD,
    database          : process.env.DB_NAME
}).promise(); // This makes it so we can use async / await rather than callbacks

// Export it for use in our application
module.exports = pool;