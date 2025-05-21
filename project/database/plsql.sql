/*
      # Citation for the following function:
2      # Date: 05/20/2025
3      # Copied from /OR/ Adapted from /OR/ Based on: FAQ Project Step 4 Draft Version 
4      # Source URL: https://canvas.oregonstate.edu/courses/1999601/assignments/10006390
*/



DROP PROCEDURE IF EXISTS DeletePlayer;

DELIMITER//

CREATE PROCEDURE DeletePlayer(IN pid INT)
BEGIN
    DELETE FROM Players WHERE player_id = pid;
END//
DELIMITER;