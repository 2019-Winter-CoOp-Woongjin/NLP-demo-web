var express = require("express");
var router = express.Router();
var logger = require("../global/logger");

var mysql = require("mysql");
var dbconfig = require("../config/dbconfig");
var conn = mysql.createConnection(dbconfig);

router.get("/", function(req, res, next) {
    var logger_caller = "/api/load-rand-text(GET)";
    var logger_args = { "prevTextID": req.query.prev_text_id };

    var prevTextID = req.query.prev_text_id;

    conn.query("SELECT * FROM Text WHERE text_id != ? ORDER BY rand() LIMIT 1", [prevTextID], function(err, results) {
        if(err) {
            logger(logger_caller, "Failed: DB Error - " + err, logger_args);
            res.sendStatus(401);
            return;
        }

        if(results.length == 0) {
            logger(logger_caller, "Failed: No Data", logger_args);
            res.sendStatus(400);
            return;
        }

        logger(logger_caller, "Success", logger_args);
        res.status(200).send({
            "textID": results[0].text_id,
            "text": results[0].text
        });
        return;
    });
});


module.exports = router;