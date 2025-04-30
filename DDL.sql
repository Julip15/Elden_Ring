/*
Group: 49
Name: Ethan Spear, Kia Wilson 
OSUOID: speare,  wilsokia
Course: CS340 Section 400
Assignment: Elden Ring Project: Step 2 Draft
*/


CREATE TABLE Players(
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
    "Player1",
    "Samurai",
    32,
    NULL,
    (SELECT location_id FROM Locations WHERE Locations.name = "Caelid")
),
(
    "Player2",
    "Bandit",
    112,
    NULL,
    (SELECT location_id FROM Locations WHERE Locations.name = "Caelid")
),
(
    "Player3",
    "Vagabond",
    9,
    NULL,
    (SELECT location_id FROM Locations WHERE Locations.name = "Limgrave")
);

CREATE TABLE Weapons(
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
    "Uchigatana",
    115,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = "Katana")
),
(
    "Longsword",
    110,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = "Straight Sword")
),
(
    "Great Knife",
    75,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = "Dagger")
),
(
    "Bloodhound's Fang",
    141,
    (SELECT category_id FROM Weapon_Categories WHERE Weapon_Categories.category_id = "Curved Greatsword"
);

CREATE TABLE Player_Weapons(
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
    (SELECT player_id FROM Players WHERE name = "Player1"),
    (SELECT weapon_id FROM Weapons WHERE name = "Uchigatana")
),
(
    (SELECT player_id FROM Players WHERE name = "Player1"),
    (SELECT weapon_id FROM Weapons WHERE name = "Bloodhound's Fang")
),
(
    (SELECT player_id FROM Players WHERE name = "Player2"),
    (SELECT weapon_id FROM Weapons WHERE name = "Great Knife")
),
(
    (SELECT player_id FROM Players WHERE name = "Player2"),
    (SELECT weapon_id FROM Weapons WHERE name = "Bloodhound's Fang")
),
(
    (SELECT player_id FROM Players WHERE name = "Player3"),
    (SELECT weapon_id FROM Weapons WHERE name = "Longsword")
);
