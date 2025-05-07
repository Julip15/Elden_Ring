/*
Group: 49
Name: Ethan Spear, Kia Wilson 
OSUOID: speare,  wilsokia
Course: CS340 Section 400
Assignment: Elden Ring Project: Step 3 Draft
*/
/*
    DML queries

1      # Citation for the following queries:
2      # Date: 05/06/25
3      # Based on: Project Step 3 Assignment Instructions; bsg_sample_data_manipulation_queries.sql
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006387
5
*/

--  populate weapons table with category names drop down.
SELECT Weapons.weapon_id, Weapons.name, Weapons.damage, Weapon_Categories.category_id AS category_name
FROM Weapons
LEFT JOIN Weapon_Categories ON Weapons.category_id = Weapon_Categories.category_id;
-- get all weapon categories to populate drop down when creating weapon 
SELECT * FROM Weapon_Categories;


-- get all weapons and weapon attributes
SELECT Enemies.enemy_id, Enemies.name, IFNULL(Enemies.health, 'N/A') AS health, Enemies.is_boss,
       Enemies.weapon_id AS weapon_id, Enemies.location_id
FROM Enemies
LEFT JOIN Weapons ON Enemies.weapon_id = Weapons.weapon_id,
LEFT JOIN Locations ON Enemies.location_id = Locations.location_id;
-- get all weapons to populate drop down for weapons when creating enenmy
SELECT * FROM Weapons;
-- get all locations to populate drop down when creating enemy
SELECT * FROM Locations;


-- get all locations and location attributes
SELECT * FROM Locations;
-- get region_id to populate drop down for creating a location 
SELECT region_id from Regions;

-- selct all regions
SELECT region_id FROM Regions;

-- add new weapon
INSERT INTO Weapons(name, damage, category_id) VALUES(:nameInput, :damageInput, :category_id_from_dropdown_Input);

-- add a new enemy
INSERT INTO Enemies(name, health, is_boss, weapon_id, location_id)
VALUES(:nameInput, :healthInput, :is_bossInput, :weapon_id_from_dropdown_Input, :location_id_from_dropdown_Input);

-- add a new location
INSERT INTO Locations(name, region_id) VALUES(:nameInput, :region_id_from_dropdown_Input);