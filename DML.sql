/*
Group: 49
Name: Ethan Spear, Kia Wilson 
OSUOID: speare,  wilsokia
Course: CS340 Section 400
Assignment: Elden Ring Project: Step 3 Draft
*/

/* Players */
SELECT Players.player_id, Players.name, Players.class,
Players.level, Players.death_count, Locations.name AS 'location' 
FROM Players JOIN Locations ON Players.location_id = Locations.location_id;

INSERT INTO Players (name, class, level, death_count, location_id)
VALUES (:nameinput, :classinput, :levelinput, :death_countinput, :location_idinput);

DELETE FROM Players WHERE player_id = :player_idinput;

SELECT player_id, name, class, level, death_count, location_id
FROM Players
WHERE player_id = :player_idinput;

UPDATE Players
SET name = :nameinput, class = :classinput, level = :levelinput, 
death_count = :death_count, location_id = :location_idinput
WHERE player_id = :player_idinput;

/* Player_Weapons */
SELECT Players.name AS player, Weapons.name AS weapon, player_weapon_id
FROM Player_Weapons
JOIN Players On Players.player_id = Player_Weapons.player_id
JOIN Weapons ON Weapons.weapon_id = Player_Weapons.weapon_id;

INSERT INTO Player_Weapons (player_id, weapon_id)
VALUES (:player_idinput, :weapon_idinput);

DELETE FROM Player_Weapons WHERE player_weapon_id = :player_weapon_idinput;

SELECT player_id, weapon_id
FROm Player_Weapons
WHERE player_weapon_id = :player_weapon_idinput;

UPDATE Player_Weapons
SET player_id = :player_idinput, weapon_id = :weapon_idinput
WHERE player_weapon_id = :player_weapon_idinput;
