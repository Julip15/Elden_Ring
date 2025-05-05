/*
Group: 49
Name: Ethan Spear, Kia Wilson 
OSUOID: speare,  wilsokia
Course: CS340 Section 400
Assignment: Elden Ring Project: Step 3 Draft
*/


SELECT Players.player_id, Players.name, Players.class,
Players.level, Players.death_count, Locations.name AS 'location' 
FROM Players JOIN Locations ON Players.location_id = Locations.location_id;



SELECT Players.name, Weapons.name
FROM Player_Weapons
JOIN Players On Players.player_id = Player_Weapons.player_id
JOIN Weapons ON Weapons.weapon_id = Player_Weapons.weapon_id;