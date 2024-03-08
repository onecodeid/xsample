BEGIN

DECLARE d_date DATE;
DECLARE d_status INTEGER;
DECLARE d_staff INTEGER;
DECLARE d_note TEXT;
DECLARE d_attachment TEXT;

DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN

GET DIAGNOSTICS CONDITION 1
@p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT, @tb = TABLE_NAME;
SELECT "ERR" as status, @p1 as data  , @p2 as message, @tb as table_name;

ROLLBACK;
END;

DECLARE EXIT HANDLER FOR SQLWARNING
BEGIN

GET DIAGNOSTICS CONDITION 1
@p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT, @tb = TABLE_NAME;
SELECT "ERR" as status, @p1 as data  , @p2 as message, @tb as table_name;

ROLLBACK;
END;

START TRANSACTION;

SET d_date = JSON_UNQUOTE(JSON_EXTRACT(hdata, "$.date"));
SET d_status = JSON_UNQUOTE(JSON_EXTRACT(hdata, "$.status"));
SET d_staff = JSON_UNQUOTE(JSON_EXTRACT(hdata, "$.staff"));
SET d_note = JSON_UNQUOTE(JSON_EXTRACT(hdata, "$.note"));
SET d_attachment = JSON_UNQUOTE(JSON_EXTRACT(hdata, "$.attachment"));

IF id <> 0 THEN

    UPDATE p_projectdetail
    SET P_ProjectDetailDate	= d_date,
        P_ProjectDetailM_StatusID = d_status,	
        P_ProjectDetailS_StaffID = d_staff,	
        P_ProjectDetailNote = d_note,
        P_ProjectDetailAttachment = d_attachment
    WHERE P_ProjectDetailID = id;

    SELECT "OK" as status, JSON_OBJECT("detail_id", id) as data;
    COMMIT;
ELSE

    SELECT "ERR" as status, "Unknown Timeline !" as message;
    ROLLBACK;
END IF;

END