var express = require("express");
var router = express.Router();
var logger = require("../global/logger");

var mysql = require("mysql");
var dbconfig = require("../config/dbconfig");
var conn = mysql.createConnection(dbconfig);

router.get("/matched", function(req, res, next) {
    var logger_caller = "/api/load-rand-qa/matched(GET)";
    var logger_args = { "textID": req.query.textID, "qType": req.query.qType, "prevQAID": req.query.prev_qa_id };

    var textID = req.query.textID;
    var qType = req.query.qType;
    var prevQAID = req.query.prev_qa_id;

    conn.query("SELECT * FROM QA WHERE text_id = ? AND q_type = ? AND qa_id != ? ORDER BY rand() LIMIT 1", [textID, qType, prevQAID], function(err, results) {
        if(err) {
            logger(logger_caller, "Failed: DB Error - " + err, logger_args);
            res.sendStatus(401);
            return;
        }

        if (results.length == 0) {
            logger(logger_caller, "Failed: No Data", logger_args);
            res.sendStatus(400);
            return;
        }

        logger(logger_caller, "Success", logger_args);
        res.status(200).send({
            "qa_id": results[0].qa_id,
            "question": results[0].question,
            "true_answer": results[0].answer
        });
        return;
    });
});

router.get("/unmatched", function(req, res, next) {
    var logger_caller = "/api/load-rand-qa/unmatched(GET)";
    var logger_args = { "textID": req.query.textID, "qType": req.query.qType, "prevQAID": req.query.prev_qa_id };

    var textID = req.query.textID;
    var qType = req.query.qType;
    var prevQAID = req.query.prev_qa_id;

    conn.query("SELECT * FROM QA WHERE text_id != ? AND q_type = ? AND qa_id != ? ORDER BY rand() LIMIT 1", [textID, qType, prevQAID], function(err, results) {
        if(err) {
            logger(logger_caller, "Failed: DB Error - " + err, logger_args);
            res.sendStatus(401);
            return;
        }

        if (results.length == 0) {
            logger(logger_caller, "Failed: No Data", logger_args);
            res.sendStatus(400);
            return;
        }

        logger(logger_caller, "Success", logger_args);
        res.status(200).send({
            "qa_id": results[0].qa_id,
            "question": results[0].question,
            "true_answer": results[0].answer
        });
        return;
    });
});

module.exports = router;