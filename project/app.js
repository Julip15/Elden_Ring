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

app.get('/Players', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Players.player_id, Players.name, Players.class,
            Players.level, Players.death_count, Locations.name AS 'location' FROM Players
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

app.get('/Player_Weapons', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = `SELECT Players.name AS 'player', Weapons.name AS 'weapon', player_weapon_id
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

app.get('/Weapon_Categories', async function (req, res) {
    try {

        const query1 = `SELECT category_id
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

//Route handler for locations
app.get('/locations', async function (req, res) {
    try {
        const [locations] = await db.query('SELECT * FROM Locations');
        const [regions] = await db.query('SELECT region_id FROM Regions'); 

        console.log('Regions:', regions);  

        res.render('locations', { locations, regions });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching locations');
    }
});

// Route handler for enemies
app.get('/enemies', async function (req, res) {
    try {
        const query1 = `
            SELECT Enemies.enemy_id, Enemies.name, IFNULL(Enemies.health, 'N/A') AS health, Enemies.is_boss,
            Weapons.name as 'weapon', Locations.name as 'location'
            FROM Enemies
            LEFT JOIN Weapons ON Enemies.weapon_id = Weapons.weapon_id
            LEFT JOIN Locations ON Enemies.location_id = Locations.location_id;
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


// Route handle for Weapons
app.get('/weapons', async function (req, res) {
    try {
        const query1 = `
            SELECT Weapons.weapon_id, Weapons.name, Weapons.damage, Weapon_Categories.category_id AS category_name
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

// Route handler for Regions 
app.get('/regions', async function (req, res) {
    try {
        const query = `
            SELECT region_id FROM Regions;
        `;
        
        const [regions] = await db.query(query);

        // Render the regions.hbs template and pass the regions data
        res.render('regions', { regions });
    } catch (error) {
        res.status(500).send(`<pre>${error.stack}</pre>`);
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
