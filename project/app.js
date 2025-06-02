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
        // In query1, select all player attributes and join on Locations for location name display
        const query1 = `SELECT Players.player_id AS 'Player ID', Players.name AS 'Name', Players.class AS 'Class',
            Players.level AS 'Level', Players.death_count AS 'Death Count', Locations.name AS 'Location' FROM Players
            JOIN Locations ON Players.location_id = Locations.location_id;`;
        const query2 = 'SELECT * FROM Locations;';
        const [players] = await db.query(query1);
        const [locations] = await db.query(query2);
        //const [homeworlds] = await db.query(query2);

        // Render the Players.hbs file, and also send the renderer
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
        // In query1, select the player_weapon_id and join Players and Weapons to display names instead of id.
        // we are using inventory as the table name for the ui
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

        // Render the Player_Weapons.hbs file, and also send the renderer
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
        
        const query1 = `SELECT category_id AS 'Category'
                        FROM Weapon_Categories;`;

        const [categories] = await db.query(query1);
        // render the Weapon_Categories page
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
        const [locations] = await db.query(`SELECT location_id AS 'Location ID', name AS 'Name', region_id AS 'Region' FROM Locations`);
        const [regions] = await db.query(`SELECT region_id FROM Regions`); 

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
2      # Date: 05/20/2025
3      # Copied from /OR/ Adapted from /OR/ Based on: Exploration Implementing CUD operations 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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

app.post('/Players/create', async function (req, res) {
    try {
        let data = req.body;
        
        const name = req.body.create_player_name
        const class_player = req.body.create_player_class
        const level = req.body.create_player_level
        const death_count = req.body.create_player_deaths
        const location_id = req.body.create_person_location
        const query = 'CALL sp_insert_player(?, ?, ?, ?, ?);';
        await db.query(query, [name, class_player, level, death_count, location_id]);
        res.redirect('/Players');
    } catch (error) {
        console.error("Error ", error);
        res.status(500).send("Failed");
    }
});

app.post('/Players/update', async function (req, res) {
    try {
        let data = req.body;
        
        const player_id = req.body.update_player_id
        const location_id = req.body.update_player_location
        const level = req.body.update_player_level
        const death_count = req.body.update_player_deaths
        const query = 'CALL sp_update_player(?, ?, ?, ?);';
        await db.query(query, [player_id, location_id, level, death_count]);
        res.redirect('/Players');
    } catch (error) {
        console.error("Error ", error);
        res.status(500).send("Failed");
    }
});

app.post('/Player_Weapons/delete', async function (req, res) {
    try {
        let data = req.body;
        
        const inventory_id = req.body.delete_inventory_id
        const query = 'CALL sp_delete_player_weapons(?);';
        await db.query(query, [inventory_id]);
        res.redirect('/Player_Weapons');
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(500).send("Failed to delete inventory item.");
    }
});

app.post('/Player_Weapons/create', async function (req, res) {
    try {
        let data = req.body;
        
        const weapon_id = req.body.create_weapon
        const player_id = req.body.create_player
        const query = 'CALL sp_insert_player_weapons(?, ?);';
        await db.query(query, [weapon_id, player_id]);
        res.redirect('/Player_Weapons');
    } catch (error) {
        console.error("Error ", error);
        res.status(500).send("Failed");
    }
});


app.post('/Player_Weapons/update', async function (req, res) {
    try {
        let data = req.body;
        
        const inventory_id = req.body.update_player_weapon
        const weapon_id = req.body.create_weapon
        const player_id = req.body.create_player
        const query = 'CALL sp_update_player_weapons(?, ?, ?);';
        await db.query(query, [inventory_id, weapon_id, player_id]);
        res.redirect('/Player_Weapons');
    } catch (error) {
        console.error("Error ", error);
        res.status(500).send("Failed");
    }
});

app.post('/Locations/create', async function (req, res) {
    try {
        let data = req.body;
        
        const name = req.body.insert_location_name
        const region = req.body.insert_location_region
        const query = 'CALL sp_insert_location(?, ?);';
        await db.query(query, [name, region]);
        res.redirect('/Locations');
    } catch (error) {
        console.error("Error ", error);
        res.status(500).send("Failed");
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
