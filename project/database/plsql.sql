



/*
      # Citation for the following function: Delete Player
2      # Date: 05/20/2025
3      # Adapted from: FAQ Project Step 4 Draft Version 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006390
*/


DROP PROCEDURE IF EXISTS sp_delete_player;

DELIMITER //

CREATE PROCEDURE sp_delete_player(IN pid INT)
BEGIN
    DELETE FROM Players WHERE player_id = pid;
END //

DELIMITER ;


/*
      # Citation for the following function:
2      # Date: 
3      # Adapted from: 
4      # Source URL: 
*/

DROP PROCEDURE IF EXISTS sp_insert_player_weapons;

DELIMITER //

CREATE PROCEDURE sp_insert_player_weapons(
    IN wid INT, 
    IN pid INT
    )
BEGIN

    INSERT INTO Player_Weapons (weapon_id, player_id)
VALUES (wid,pid);

END //

DELIMITER ;

/*
      # Citation for the following function:
2      # Date: 
3      # Adapted from: 
4      # Source URL: 
*/

DROP PROCEDURE IF EXISTS sp_delete_player_weapons;

DELIMITER //

CREATE PROCEDURE sp_delete_player_weapons(
    IN pwid INT
    )
BEGIN

    DELETE FROM Player_Weapons WHERE player_weapon_id = pwid;

END //

DELIMITER ;

/*
      # Citation for the following function:
2      # Date: 
3      # Adapted from: 
4      # Source URL: 
*/

DROP PROCEDURE IF EXISTS sp_update_player_weapons;

DELIMITER //

CREATE PROCEDURE sp_update_player_weapons(
    IN pwid INT,
    IN wid INT,
    IN pid INT
    )
BEGIN

    UPDATE Player_Weapons SET weapon_id = wid, player_id = pid
    WHERE player_weapon_id = pwid;

END //

DELIMITER ;

/*
      # Citation for the following function:
2      # Date: 
3      # Adapted from: 
4      # Source URL: 
*/

DROP PROCEDURE IF EXISTS sp_insert_player;

DELIMITER //

CREATE PROCEDURE sp_insert_player(
    IN nameinput VARCHAR(255), 
    IN classinput VARCHAR(255), 
    IN levelinput INT, 
    IN death_countinput INT, 
    IN location_idinput INT
    )
BEGIN

    INSERT INTO Players (name, class, level, death_count, location_id)
VALUES (nameinput, classinput, levelinput, death_countinput, location_idinput);

END //

DELIMITER ;

/*
      # Citation for the following function:
2      # Date: 
3      # Adapted from: 
4      # Source URL: 
*/

DROP PROCEDURE IF EXISTS sp_update_player;

DELIMITER //

CREATE PROCEDURE sp_update_player(
    IN pid INT,
    IN location_idinput INT, 
    IN levelinput INT,
    IN death_countinput INT
    )
BEGIN

    UPDATE Players SET  location_id = location_idinput, level = levelinput,
    death_count = death_countinput
    WHERE player_id = pid; 

END //

DELIMITER ;

/*
      # Citation for the following function:
2      # Date: 
3      # Adapted from: 
4      # Source URL: 
*/

DROP PROCEDURE IF EXISTS sp_insert_location;

DELIMITER //

CREATE PROCEDURE sp_insert_location(
    IN nameinput VARCHAR(255),
    IN region_idinput VARCHAR(45)
    )
BEGIN

    INSERT INTO Locations (name, region_id)
VALUES (nameinput, region_idinput);

END //

DELIMITER ;

/*
      # Citation for the following function: Delete Location
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/

DROP PROCEDURE IF EXISTS sp_delete_location;

DELIMITER //

CREATE PROCEDURE sp_delete_location(IN lid INT)
BEGIN
    DELETE FROM Locations WHERE location_id = lid;
END //

DELIMITER ;

/*
      # Citation for the following function: Delete Weapon
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/

DROP PROCEDURE IF EXISTS sp_delete_weapon;

DELIMITER //

CREATE PROCEDURE sp_delete_weapon(IN wid INT)
BEGIN
    DELETE FROM Weapons WHERE weapon_id = wid;
END //

DELIMITER ;

/*
      # Citation for the following function: Insert Weapon
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/

DROP PROCEDURE IF EXISTS sp_insert_weapon;

DELIMITER //

CREATE PROCEDURE sp_insert_weapon(
    IN nameinput VARCHAR(255),
    IN damageinput INT,
    IN category_idinput VARCHAR(255)
)
BEGIN
    INSERT INTO Weapons (name, damage, category_id)
    VALUES (nameinput, damageinput, category_idinput);
END //

DELIMITER ;


/*
      # Citation for the following function: Delete Enemy
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/

DROP PROCEDURE IF EXISTS sp_delete_enemy;

DELIMITER //

CREATE PROCEDURE sp_delete_enemy(IN eid INT)
BEGIN
    DELETE FROM Enemies WHERE enemy_id = eid;
END //

DELIMITER ;

/*
      # Citation for the following function: Insert Enemy
2     # Date: 05/31/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
*/
DROP PROCEDURE IF EXISTS sp_insert_enemy;

DELIMITER //

CREATE PROCEDURE sp_insert_enemy(
    IN nameinput VARCHAR(255),
    IN healthinput INT,
    IN is_bossinput TINYINT,
    IN weapon_idinput INT,
    IN location_idinput INT
)
BEGIN
    INSERT INTO Enemies (name, health, is_boss, weapon_id, location_id)
    VALUES (nameinput, healthinput, is_bossinput, weapon_idinput, location_idinput);
END //

DELIMITER ;
