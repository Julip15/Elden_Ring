/* 
# Citation for the following page: DDl.sql
# Date: 05/20/2025
# Adapted from: Exploration: PL/SQL part 1, SP, View and Function
# Source URL:https://canvas.oregonstate.edu/courses/1999601/pages/exploration-pl-slash-sql-part-1-sp-view-and-function?module_item_id=25352958
# No AI used.
*/



/* Stored Procedure for DDL */
DROP PROCEDURE IF EXISTS sp_load_eldenringdb;

DELIMiTER //

CREATE PROCEDURE sp_load_eldenringdb()
BEGIN


    SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS Weapon_Categories;

CREATE TABLE Weapon_Categories (
    category_id varchar(255) UNIQUE NOT NULL, 
    PRIMARY KEY (category_id)
);


-- Add weapon categories   
INSERT INTO Weapon_Categories (category_id)
VALUES 
    ('Katana'), 
    ('Straight Sword'), 
    ('Dagger'), 
    ('Curved Greatsword');

DROP TABLE IF EXISTS Weapons;

-- Weapons table
CREATE TABLE Weapons(
    weapon_id int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    damage int NOT NULL,
    category_id varchar(255),
    FOREIGN KEY (category_id) REFERENCES Weapon_Categories(category_id),
    PRIMARY KEY (weapon_id)
);

-- Add weapons
INSERT INTO Weapons(
    name,
    damage,
    category_id
)
VALUES
(
    'Uchigatana',
    115,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = 'Katana')
),
(
    'Longsword',
    110,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = 'Straight Sword')
),
(
    "Great Knife",
    75,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = 'Dagger')
),
(
    'Bloodhound''s Fang',
    141,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = 'Curved Greatsword')
),
(
    'Lazuli Glintstone Sword',
    79,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = 'Straight Sword')
);

DROP TABLE IF EXISTS Regions;

-- Regions table 
CREATE TABLE Regions (
    region_id varchar(45) UNIQUE NOT NULL,
    PRIMARY KEY (region_id) 
);

-- Add regions
INSERT INTO Regions (region_id)
VALUES
    ('Limgrave'),
    ('Caelid'),
    ('Miquella''s Haligree'),
    ('Liurnia of the Lakes'),
    ('Weeping Peninsula');

DROP TABLE IF EXISTS Locations;

-- Locations table
CREATE TABLE Locations(
    location_id int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    region_id varchar(45),
    FOREIGN KEY (region_id) REFERENCES Regions(region_id),
    PRIMARY KEY (location_id)
);

-- Add locations
INSERT INTO Locations (name, region_id)
VALUES 
(
    'Aeonia Swamp', 
    (SELECT region_id FROM Regions Where region_id = 'Caelid')
),
(
    'Redmane Castle',
    (SELECT region_id FROM Regions Where region_id = 'Caelid')
),
(   
    'Stormhill',
    (SELECT region_id FROM Regions Where region_id = 'Limgrave')
),
(
    'Forlorn Hound Evergaol',
    (SELECT region_id FROM Regions Where region_id = 'Limgrave')
),
(
    'Elphael, Brace of the Haligree',
    (SELECT region_id FROM Regions Where region_id = 'Miquella''s Haligree')
),
(
    'Raya Lucaria Academy',
    (SELECT region_id FROM Regions Where region_id = 'Liurnia of the Lakes')
),
(
    'Coastal Cave',
    (SELECT region_id FROM Regions Where region_id = 'Limgrave')
);

DROP TABLE IF EXISTS Players;

-- Players table
CREATE TABLE Players(
    player_id int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    class varchar(55) NOT NULL,
    level int NOT NULL,
    death_count int DEFAULT 0,
    location_id int,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id) ON DELETE SET NULL,
    PRIMARY KEY (player_id)
);

-- Add players
INSERT INTO Players(
    name,
    class, 
    level, 
    death_count,
    location_id
)
VALUES
(
    'Player1',
    "Samurai",
    32,
    0,
    (SELECT location_id FROM Locations WHERE Locations.name = 'Redmane Castle')
),
(
    'Player2',
    'Bandit',
    112,
    19,
    (SELECT location_id FROM Locations WHERE Locations.name = 'Aeonia Swamp')
),
(
    'Player3',
    'Vagabond',
    9,
    0,
    (SELECT location_id FROM Locations WHERE Locations.name = 'Stormhill')
);

DROP TABLE IF EXISTS Enemies;

-- Enemies table
Create TABLE Enemies (
    enemy_id int AUTO_INCREMENT UNIQUE NOT NULL, 
    name varchar(45) NOT NULL,
    health int,
    is_boss tinyint(1),
    weapon_id int,
    location_id int,
    FOREIGN KEY (weapon_id) REFERENCES Weapons(weapon_id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id) ON DELETE SET NULL,
    PRIMARY KEY  (enemy_id)
);

-- Add enemies  
INSERT INTO Enemies (name, health, is_boss, weapon_id, location_id)
VALUES 
(
    'Bloodhound Knight Darriwil',
    1450,
    1,
    (SELECT weapon_id FROM Weapons WHERE Weapons.name = 'Bloodhound''s Fang'),
    (SELECT location_id FROM Locations WHERE Locations.name = 'Forlorn Hound Evergaol')
),
(
    'Commander O''Neil',
    9210,
    1,
    (SELECT weapon_id FROM Weapons WHERE Weapons.name = 'Longsword'),
    (SELECT location_id FROM Locations WHERE Locations.name = 'Aeonia Swamp')
),
(
    'Lazuli Sorcerer',
    NULL,
    0,
    (SELECT weapon_id FROM Weapons WHERE Weapons.name = 'Lazuli Glintstone Sword'),
    (SELECT location_id FROM Locations WHERE Locations.name = 'Raya Lucaria Academy')
),
(
    'Demi-Human',
    NULL,
    0,
    (SELECT weapon_id FROM Weapons WHERE Weapons.name = 'Great Knife'),
    (SELECT location_id FROM Locations WHERE Locations.name = 'Coastal Cave')
);

DROP TABLE IF EXISTS Player_Weapons;

-- Player weapons table
CREATE TABLE Player_Weapons(
    player_weapon_id int AUTO_INCREMENT UNIQUE,
    weapon_id int,
    player_id int,
    FOREIGN KEY (weapon_id) REFERENCES Weapons(weapon_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    PRIMARY KEY (player_weapon_id)
);

-- Query's to insert information to player weapons
INSERT INTO Player_Weapons(
    player_id,
    weapon_id
)
VALUES
(
    (SELECT player_id FROM Players WHERE name = 'Player1'),
    (SELECT weapon_id FROM Weapons WHERE name = 'Uchigatana')
),
(
    (SELECT player_id FROM Players WHERE name = 'Player1'),
    (SELECT weapon_id FROM Weapons WHERE name = 'Bloodhound''s Fang')
),
(
    (SELECT player_id FROM Players WHERE name = 'Player2'),
    (SELECT weapon_id FROM Weapons WHERE name = 'Great Knife')
),
(
    (SELECT player_id FROM Players WHERE name = 'Player2'),
    (SELECT weapon_id FROM Weapons WHERE name = 'Bloodhound''s Fang')
),
(
    (SELECT player_id FROM Players WHERE name = 'Player3'),
    (SELECT weapon_id FROM Weapons WHERE name = 'Longsword')
);

    SET FOREIGN_KEY_CHECKS=1;
END //

DELIMITER ;
