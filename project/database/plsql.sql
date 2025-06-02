



/*
      # Citation for the following function:
2      # Date: 05/20/2025
3      # Adapted from: FAQ Project Step 4 Draft Version 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006390
*/



DROP PROCEDURE IF EXISTS DeletePlayer;

DELIMITER //

CREATE PROCEDURE DeletePlayer(IN pid INT)
BEGIN

    DELETE FROM Players WHERE player_id = pid;

END //

DELIMITER ;

/*
      # Citation for the following function:
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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
2     # Date: 6/02/2025
3     # Adapted from: Exploration Implementing CUD operations 
4     # Source URL: https://canvas.oregonstate.edu/courses/1999601/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25352968
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
