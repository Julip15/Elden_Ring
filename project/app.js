/*
      # Citation for the following page:
2      # Date: 06/2/2025
3      #  Based on: Activity 2 - Connect webapp to database and Exploration - Implementing CUD operations in your app.
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370 https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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
3      # Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5      # https://canvas.oregonstate.edu/courses/1999601/pages/exploration-sql-joins?module_item_id=25352923
*/
app.get('/Players', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, select all player attributes and join on Locations for location name display
        const query1 = `SELECT Players.player_id AS 'Player ID', Players.name AS 'Name', Players.class AS 'Class',
            Players.level AS 'Level', Players.death_count AS 'Death Count', Locations.name AS 'Location' FROM Players
            LEFT JOIN Locations ON Players.location_id = Locations.location_id;`;
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

/*
      # Citation for the following function:
2      # Date: 05/6/2025
3      # Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
5      # https://canvas.oregonstate.edu/courses/1999601/pages/exploration-sql-joins?module_item_id=25352923
*/
app.get('/Player_Weapons', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, select the player_weapon_id and join Players and Weapons to display names instead of id.
        // we are using inventory as the table name for the ui
        const query1 = `SELECT  player_weapon_id AS 'Inventory ID', Players.name AS 'Player', Weapons.name AS 'Weapon'
                        FROM Player_Weapons
                        JOIN Players On Players.player_id = Player_Weapons.player_id
                        JOIN Weapons ON Weapons.weapon_id = Player_Weapons.weapon_id
                        ORDER BY player_weapon_id;`;
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

/*
      # Citation for the following function:
2     # Date: 05/6/2025
3     # Based on: Activity 2 - Connect webapp to database
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006370
*/
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

/*
      # Citation for the following function:
2      # Date: 05/6/2025
3      # Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins 
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
3      # Based on: Activity 2 - Connect webapp to database , Activity 8 SQL Queries of Multiple JOins 
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
3     # Based on: Activity 2 - Connect webapp to database, Exploration SQL Joins
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
3     # Based on: Activity 2 - Connect webapp to database, Intro to SQL
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
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Will reset the database to the stored procedure data. 
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
      # Citation for the following function: Delete Player Route Handler
2     # Date: 05/20/2025
3     # Adapted from: Exploration Implementing CUD operations 
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

/*
      # Citation for the following function:
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for creating a player.
app.post('/Players/create', async function (req, res) {
    try {
        let data = req.body; // data from the webpage
        
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

/*
      # Citation for the following function:
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for updating a player.
app.post('/Players/update', async function (req, res) {
    try {
        let data = req.body; // data from the webpage
        
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

/*
      # Citation for the following function:
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for deleting an inventory item. 
app.post('/Player_Weapons/delete', async function (req, res) {
    try {
        let data = req.body; // data from the webpage
        
        const inventory_id = req.body.delete_inventory_id
        const query = 'CALL sp_delete_player_weapons(?);';
        await db.query(query, [inventory_id]);
        res.redirect('/Player_Weapons');
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(500).send("Failed to delete inventory item.");
    }
});

/*
      # Citation for the following function:
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for creating an inventory item. 
app.post('/Player_Weapons/create', async function (req, res) {
    try {
        let data = req.body; // data from the webpage
        
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

/*
      # Citation for the following function:
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for updating an inventory item (aka Player_weapons item).
app.post('/Player_Weapons/update', async function (req, res) {
    try {
        let data = req.body; // data from the webpage
         
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
/*
      # Citation for the following function:
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for creating a location.
app.post('/Locations/create', async function (req, res) {
    try {
        let data = req.body; // data from the webpage
        
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

/*
      # Citation for the following function: Locations Delete Route Handler
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for locations delete
app.post('/Locations/delete', async function (req, res) {
    try {
        let data = req.body; // data from the webpage
        
        const locationId = req.body.delete_location_id;
        const query = 'CALL sp_delete_location(?);';
              const result = await db.query(query, [locationId]);
        console.log("Delete query result:", result)
        res.redirect('/Locations');
    } catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).send("Failed to delete location.");
    }
});




/*
      # Citation for the following function: Weapon Delete Route Handler
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/

// Route handler for Weapons Delete
app.post('/Weapons/delete', async function (req, res) {
    try {
        const weaponId = req.body.delete_weapon_id; 
        const query = 'CALL sp_delete_weapon(?);';
            const result = await db.query(query, [weaponId]);
        console.log("Delete result:", result);
        res.redirect('/Weapons');
    } catch (error) {
        console.error("Error deleting weapon:", error);
        res.status(500).send("Failed to delete weapon.");
    }
});

/*
      # Citation for the following function: Insert Weapons Route Handler
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/

// Route handlder for Insert Weapon
app.post('/Weapons/create', async function (req, res) {
    try {
        const name = req.body.create_weapon_name;
        const damage = req.body.create_weapon_damage;
        const category_id = req.body.create_weapon_category_id;

        const query = 'CALL sp_insert_weapon(?, ?, ?);';
        await db.query(query, [name, damage, category_id]);
        res.redirect('/Weapons');
    } catch (error) {
        console.error("Error creating weapon", error);
        res.status(500).send("Failed to create weapon.");
    }
});


/*
      # Citation for the following function: Delete Enemy Route Handler 
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
// Route handler for delete enemy

app.post('/Enemies/delete', async function (req, res) {
    try {
        const enemyId = req.body.delete_enemy_id;
        const query = 'CALL sp_delete_enemy(?);';
        await db.query(query, [enemyId]);
        res.redirect('/Enemies');
    } catch (error) {
        console.error("Error deleting enemy:", error);
        res.status(500).send("Failed to delete enemy.");
    }
});


/*
      # Citation for the following function: Insert Enemy Route Handler
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/

// Route handler for Insert Enemy
app.post('/Enemies/create', async function (req, res) {
    try {
        const name = req.body.create_enemy_name;
        const health = req.body.create_enemy_health;
        const is_boss = req.body.create_enemy_is_boss;
        const weapon_id = req.body.create_enemy_weapon_id || null;
        const location_id = req.body.create_enemy_location_id || null;

        const query = 'CALL sp_insert_enemy(?, ?, ?, ?, ?);';
        await db.query(query, [name, health, is_boss, weapon_id, location_id]);
        res.redirect('/Enemies');
    } catch (error) {
        console.error("Error creating enemy:", error);
        res.status(500).send("Failed to create enemy.");
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







        
