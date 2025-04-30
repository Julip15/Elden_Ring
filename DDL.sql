/*
Group: 49
Name: Ethan Spear, Kia Wilson 
OSUOID: speare,  wilsokia
Course: CS340 Section 400
Assignment: Elden Ring Project: Step 2 Draft
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE TABLE Weapon_Categories (
    category_id varchar(255) UNIQUE NOT NULL, 
    PRIMARY KEY (category_id)
);


INSERT INTO Weapon_Categories (category_id)
VALUES 
    ('Katana'), 
    ('Straight Sword'), 
    ('Dagger'), 
    ('Curved Greatsword');


CREATE OR REPLACE TABLE Weapons(
    weapon_id int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    damage int NOT NULL,
    category_id varchar(255),
    FOREIGN KEY (category_id) REFERENCES Weapon_Categories(category_id),
    PRIMARY KEY (weapon_id)
);

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


CREATE OR REPLACE TABLE Regions (
    region_id varchar(45) UNIQUE NOT NULL,
    PRIMARY KEY (region_id) 
);

INSERT INTO Regions (region_id)
VALUES
    ('Limgrave'),
    ('Caelid'),
    ('Miquella''s Haligree'),
    ('Liurnia of the Lakes'),
    ('Weeping Peninsula');



CREATE OR REPLACE TABLE Locations(
    location_id int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    region_id varchar(45),
    FOREIGN KEY (region_id) REFERENCES Regions(region_id),
    PRIMARY KEY (location_id)
);

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


CREATE OR REPLACE TABLE Players(
    player_id int AUTO_INCREMENT UNIQUE NOT NULL,
    name varchar(255) NOT NULL,
    class varchar(55) NOT NULL,
    level int NOT NULL,
    death_count int,
    location_id int,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id),
    PRIMARY KEY (player_id)
);

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
    NULL,
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
    NULL,
    (SELECT location_id FROM Locations WHERE Locations.name = 'Stormhill')
);


Create OR REPLACE TABLE Enemies (
    enemy_id int AUTO_INCREMENT UNIQUE NOT NULL, 
    name varchar(45) NOT NULL,
    health int,
    is_boss tinyint(1),
    weapon_id int,
    location_id int,
    FOREIGN KEY (weapon_id) REFERENCES Weapons(weapon_id),
    FOREIGN KEY (location_id) REFERENCES Locations(location_id),
    PRIMARY KEY  (enemy_id)
);
    
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


CREATE OR REPLACE TABLE Player_Weapons(
    weapon_id int,
    player_id int,
    FOREIGN KEY (weapon_id) REFERENCES Weapons(weapon_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    PRIMARY KEY (player_id, weapon_id)
);

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
COMMIT;
