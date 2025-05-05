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
VALUES (:nameinput, :classinput, :levelinput, :death_countinput, :location_idinput,);

DELETE FROM Players WHERE player_id = :player_idinput

SELECT player_id, name, class, level, death_count, location_id
FROM Players
WHERE player_id = :player_idinput

SET name = :nameinput, class = :classinput, level = :levelinput, 
death_count = :death_count, location_id = :location_idinput
WHERE player_id = :player_idinput

/* Player_Weapons */
SELECT Players.name, Weapons.name
FROM Player_Weapons
JOIN Players On Players.player_id = Player_Weapons.player_id
JOIN Weapons ON Weapons.weapon_id = Player_Weapons.weapon_id;