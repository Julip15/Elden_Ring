/*
      # Citation for the following page:
2      # Date: 05/6/2025
3      # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
*/

// ########################################
// ########## SETUP

// Express
require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

/*
      # Citation for the following function:
2      # Date: 05/6/2025
3      # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5      # https://canvas.oregonstate.edu/courses/1999601/pages/exploration-sql-joins?module_item_id=25352923
*/
app.get('/Players', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Players.player_id AS 'Player ID', Players.name AS 'Name', Players.class AS 'Class',
            Players.level AS 'Level', Players.death_count AS 'Death Count', Locations.name AS 'Location' FROM Players
            JOIN Locations ON Players.location_id = Locations.location_id;`;
        const query2 = 'SELECT * FROM Locations;';
        const [players] = await db.query(query1);
        const [locations] = await db.query(query2);
        //const [homeworlds] = await db.query(query2);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('Players', { players: players, locations: locations});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

/*
      # Citation for the following function:
2      # Date: 05/6/2025
3      # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5      # https://canvas.oregonstate.edu/courses/1999601/pages/exploration-sql-joins?module_item_id=25352923
*/
app.get('/Player_Weapons', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT  player_weapon_id AS 'Inventory ID', Players.name AS 'Player', Weapons.name AS 'Weapon'
                        FROM Player_Weapons
                        JOIN Players On Players.player_id = Player_Weapons.player_id
                        JOIN Weapons ON Weapons.weapon_id = Player_Weapons.weapon_id;`;
        const query2 = 'SELECT * FROM Players;';
        const query3 = 'SELECT * FROM Weapons;';
        const [inventory] = await db.query(query1);
        const [players] = await db.query(query2);
        const [weapons] = await db.query(query3);
        //const [homeworlds] = await db.query(query2);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('Player_Weapons', { inventory: inventory, players: players, weapons: weapons});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});
/*
      # Citation for the following function:
2     # Date: 05/6/2025
3     # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
*/

// Route Handler for Weapons Categories
app.get('/Weapon_Categories', async function (req, res) {
    try {

        const query1 = `SELECT category_id AS 'Category'
                        FROM Weapon_Categories;`;

        const [categories] = await db.query(query1);

        res.render('Weapon_Categories', { categories: categories});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

/*
      # Citation for the following function:
2      # Date: 05/6/2025
3      # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5      # https://canvas.oregonstate.edu/courses/1999601/pages/exploration-sql-joins?module_item_id=25352923
*/

//Route handler for locations
app.get('/locations', async function (req, res) {
    try {
        const [locations] = await db.query(`SELECT location_id AS 'Location ID', name AS 'Name', region_id AS 'Region' FROM Locations`);
        const [regions] = await db.query(`SELECT region_id FROM Regions`); 

        console.log('Regions:', regions);  

        res.render('locations', { locations, regions });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching locations');
    }
});

/*
      # Citation for the following function:
2      # Date: 05/6/2025
3      # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database , Activity 8 SQL Queries of Multiple JOins 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5      # https://canvas.oregonstate.edu/courses/1999601/pages/activity-8-sql-queries-of-multiple-tables-joins?module_item_id=25352927
*/
// Route handler for enemies
app.get('/enemies', async function (req, res) {
    try {
        const query1 = `
            SELECT Enemies.enemy_id AS 'Enemy ID', Enemies.name AS 'Name', IFNULL(Enemies.health, 'N/A') AS Health,             
            CASE
                WHEN Enemies.is_boss = 1 THEN 'YES'
                WHEN Enemies.is_boss = 0 THEN 'NO'
            END AS 'Is Boss',
            Weapons.name as 'Weapon', Locations.name as 'Location'
            FROM Enemies
            LEFT JOIN Weapons ON Enemies.weapon_id = Weapons.weapon_id
            LEFT JOIN Locations ON Enemies.location_id = Locations.location_id

        `;
        const query2 = `SELECT * FROM Weapons;`;
        const query3 = `SELECT * FROM Locations;`;

        const [enemy] = await db.query(query1);
        const [weapons] = await db.query(query2);
        const [locations] = await db.query(query3);

        res.render('enemies', {
            enemies: enemy,
            weapons: weapons,
            locations: locations
        });

    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

/*
      # Citation for the following function:
2     # Date: 05/6/2025
3     # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5     # https://canvas.oregonstate.edu/courses/1999601/pages/exploration-sql-joins?module_item_id=25352923
*/

// Route handle for Weapons
app.get('/weapons', async function (req, res) {
    try {
        const query1 = `
            SELECT Weapons.weapon_id AS 'Weapon ID', Weapons.name AS 'Name', Weapons.damage AS 'Damage', Weapon_Categories.category_id AS 'Category'
            FROM Weapons
            LEFT JOIN Weapon_Categories ON Weapons.category_id = Weapon_Categories.category_id;
        `;
        const query2 = `SELECT * FROM Weapon_Categories;`;

        const [weapons] = await db.query(query1);
        const [weapon_categories] = await db.query(query2);

        res.render('weapons', { weapons, weapon_categories });

    } catch (error) {
        res.status(500).send(`<pre>${error.stack}</pre>`);
    }
});

/*
      # Citation for the following function:
2     # Date: 05/6/2025
3     # Copied from /OR/ Adapted from /OR/ Based on: Activity 2 - Connect webapp to database, Intro to SQL
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5     # https://canvas.oregonstate.edu/courses/1999601/pages/exploration-intro-to-sql?module_item_id=25352908
*/
// Route handler for Regions 
app.get('/regions', async function (req, res) {
    try {
        const query = `
            SELECT region_id AS 'Region' FROM Regions;
        `;
        
        const [regions] = await db.query(query);

        // Render the regions.hbs template and pass the regions data
        res.render('regions', { regions });
    } catch (error) {
        res.status(500).send(`<pre>${error.stack}</pre>`);
    }
});

/*
      # Citation for the following function:
2     # Date: 05/20/2025
3     # Copied from /OR/ Adapted from /OR/ Based on: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for Home Reload
app.post('/home/reload', async function(req, res){
    try {
        const reloaddb = `CALL sp_load_eldenringdb();`;
    
        const [result] = await db.query(reloaddb);
    
        res.redirect('/')
        } catch(error) {
            console.error('No')
            res.status(500).send(`<pre>${error.stack}</pre>`);
        }
});

/*
      # Citation for the following function:
2     # Date: 05/20/2025
3     # Copied from /OR/ Adapted from /OR/ Based on: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for delete player
app.post('/Players/delete', async function (req, res) {
    try {
        let data = req.body;
        
        const playerId = req.body.delete_player_id;
        const query = 'CALL DeletePlayer(?);';
        await db.query(query, [playerId]);
        res.redirect('/Players');
    } catch (error) {
        console.error("Error deleting player:", error);
        res.status(500).send("Failed to delete player.");
    }
});





// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});