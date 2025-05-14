/*
Group: 49
Name: Ethan Spear, Kia Wilson 
OSUOID: speare,  wilsokia
Course: CS340 Section 400
Assignment: Elden Ring Project: Step 3 Draft
*/

/* Players */
/* Select for webpage */
SELECT Players.player_id AS 'Player ID', Players.name AS 'Name', Players.class AS 'Class',
Players.level AS 'Level', Players.death_count AS 'Death Count', Locations.name AS 'Location' FROM Players
JOIN Locations ON Players.location_id = Locations.location_id;

/* add new Player */
INSERT INTO Players (name, class, level, death_count, location_id)
VALUES (:nameinput, :classinput, :levelinput, :death_countinput, :location_idinput);

/* delete Player */
DELETE FROM Players WHERE player_id = :player_idinput;

/* Select Player for update */
SELECT player_id, name, class, level, death_count, location_id
FROM Players
WHERE player_id = :player_idinput;

/* update Player */
UPDATE Players
SET name = :nameinput, class = :classinput, level = :levelinput, 
death_count = :death_count, location_id = :location_idinput
WHERE player_id = :player_idinput;

/* Player_Weapons */
/* Select for webpage */
SELECT  player_weapon_id AS 'Inventory ID', Players.name AS 'Player', Weapons.name AS 'Weapon'
FROM Player_Weapons
JOIN Players On Players.player_id = Player_Weapons.player_id
JOIN Weapons ON Weapons.weapon_id = Player_Weapons.weapon_id;

/* add new Player_Weapon */
INSERT INTO Player_Weapons (player_id, weapon_id)
VALUES (:player_idinput, :weapon_idinput);

/* delete Player_Weapon */
DELETE FROM Player_Weapons WHERE player_weapon_id = :player_weapon_idinput;

/* select for update Player_Weapon */
SELECT player_id, weapon_id
FROm Player_Weapons
WHERE player_weapon_id = :player_weapon_idinput;

/* update Player_Weapon */
UPDATE Player_Weapons
SET player_id = :player_idinput, weapon_id = :weapon_idinput
WHERE player_weapon_id = :player_weapon_idinput;

/* Weapon_categories */
SELECT category_id AS 'Category'
FROM Weapon_Categories;

--  populate weapons table with category names drop down.
SELECT Weapons.weapon_id AS 'Weapon ID', Weapons.name AS 'Name', Weapons.damage AS 'Damage', Weapon_Categories.category_id AS 'Category'
FROM Weapons
LEFT JOIN Weapon_Categories ON Weapons.category_id = Weapon_Categories.category_id;
-- get all weapon categories to populate drop down when creating weapon 
SELECT * FROM Weapon_Categories;


-- get all weapons and weapon attributes
SELECT Enemies.enemy_id AS 'Enemy ID', Enemies.name AS 'Name', IFNULL(Enemies.health, 'N/A') AS Health,             
CASE
    WHEN Enemies.is_boss = 1 THEN 'YES'
    WHEN Enemies.is_boss = 0 THEN 'NO'
END AS 'Is Boss',
Weapons.name as 'Weapon', Locations.name as 'Location'
FROM Enemies
LEFT JOIN Weapons ON Enemies.weapon_id = Weapons.weapon_id
LEFT JOIN Locations ON Enemies.location_id = Locations.location_id;
-- get all weapons to populate drop down for weapons when creating enenmy
SELECT * FROM Weapons;
-- get all locations to populate drop down when creating enemy
SELECT * FROM Locations;


-- get all locations and location attributes
SELECT location_id AS 'Location ID', name AS 'Name', region_id AS 'Region' FROM Locations;
-- get region_id to populate drop down for creating a location 
SELECT region_id from Regions;

-- selct all regions
SELECT region_id AS 'Region' FROM Regions;

-- add new weapon
INSERT INTO Weapons(name, damage, category_id) VALUES(:nameInput, :damageInput, :category_id_from_dropdown_Input);

-- add a new enemy
INSERT INTO Enemies(name, health, is_boss, weapon_id, location_id)
VALUES(:nameInput, :healthInput, :is_bossInput, :weapon_id_from_dropdown_Input, :location_id_from_dropdown_Input);

-- add a new location
INSERT INTO Locations(name, region_id) VALUES(:nameInput, :region_id_from_dropdown_Input);

