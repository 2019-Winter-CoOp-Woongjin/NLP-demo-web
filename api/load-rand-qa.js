var express = require("express");
var router = express.Router();
var logger = require("../global/logger");

var mysql = require("mysql");
var dbconfig = require("../config/dbconfig");
var conn = mysql.createConnection(dbconfig);

router.get("/matched", function (req, res, next) {
    var logger_caller = "/api/load-rand-qa/matched(GET)";
    var logger_args = { "textID": req.query.textID, "qType": req.query.qType, "prevQAID": req.query.prev_qa_id };

    var textID = req.query.textID;
    var qType = req.query.qType;
    var prevQAID = req.query.prev_qa_id;

    conn.query("SELECT * FROM QA WHERE text_id = ? AND q_type = ? AND qa_id != ? ORDER BY rand() LIMIT 1", [textID, qType, prevQAID], function (err, results) {
        if (err) {
            logger(logger_caller, "Failed: DB Error", logger_args);
            res.sendStatus(401);
            return;
        }

        if (results.length == 0) {
            logger(logger_caller, "Failed: No Data", logger_args);
            res.sendStatus(400);
            return;
        }

        if (qType == 1) {
            conn.query("SELECT * FROM Choice WHERE qa_id = ?", [results[0].qa_id], function (err2, results2) {
                if (err2) {
                    logger(logger_caller, "Failed: DB Error", logger_args);
                    res.sendStatus(401);
                    return;
                }
                
                if (results2.length != 4) {
                    logger(logger_caller, "Failed: No Data", logger_args);
                    res.sendStatus(400);
                    return;
                }

                var choice1 = null;
                var choice2 = null;
                var choice3 = null;
                var choice4 = null;
                for (var i = 0; i < 4; i++) {
                    var item = results2[i];

                    switch(item.choice_num) {
                        case 1:
                            choice1 = item.choice;
                            break;
                        case 2:
                            choice2 = item.choice;
                            break;
                        case 3:
                            choice3 = item.choice;
                            break;
                        case 4:
                            choice4 = item.choice;
                            break;
                    }
                }


                if(choice1 == null || choice2 == null || choice3 == null || choice4 == null) {
                    logger(logger_caller, "Failed: DB Data lost its integrity", logger_args);
                    res.sendStatus(400);
                    return;
                }

                res.status(200).send({
                    "qa_id": results[0].qa_id,
                    "question": results[0].question,
                    "answer": results[0].answer,
                    "choices": [
                        choice1,
                        choice2,
                        choice3,
                        choice4
                    ]
                });
            });
        } else {
            res.status(200).send({
                "qa_id": results[0].qa_id,
                "question": results[0].question,
                "answer": results[0].answer
            });
        }

        logger(logger_caller, "Success", logger_args);
        return;
    });
});

router.get("/unmatched", function (req, res, next) {
    var logger_caller = "/api/load-rand-qa/unmatched(GET)";
    var logger_args = { "textID": req.query.textID, "qType": req.query.qType, "prevQAID": req.query.prev_qa_id };

    var textID = req.query.textID;
    var qType = req.query.qType;
    var prevQAID = req.query.prev_qa_id;

    conn.query("SELECT * FROM QA WHERE text_id != ? AND q_type = ? AND qa_id != ? ORDER BY rand() LIMIT 1", [textID, qType, prevQAID], function (err, results) {
        if (err) {
            logger(logger_caller, "Failed: DB Error - " + err, logger_args);
            res.sendStatus(401);
            return;
        }

        if (results.length == 0) {
            logger(logger_caller, "Failed: No Data", logger_args);
            res.sendStatus(400);
            return;
        }

        if (qType == 1) {
            conn.query("SELECT * FROM Choice WHERE qa_id = ?", [results[0].qa_id], function (err2, results2) {
                if (err2) {
                    logger(logger_caller, "Failed: DB Error - " + err, logger_args);
                    res.sendStatus(401);
                    return;
                }

                if (results2.length != 4) {
                    logger(logger_caller, "Failed: DB Data lost its integrity", logger_args);
                    res.sendStatus(400);
                    return;
                }

                var choice1 = null;
                var choice2 = null;
                var choice3 = null;
                var choice4 = null;
                for (var i = 0; i < 4; i++) {
                    var item = results2[i];
                    
                    switch(item.choice_num) {
                        case 1:
                            choice1 = item.choice;
                            break;
                        case 2:
                            choice2 = item.choice;
                            break;
                        case 3:
                            choice3 = item.choice;
                            break;
                        case 4:
                            choice4 = item.choice;
                            break;
                    }
                }

                if(choice1 == null || choice2 == null || choice3 == null || choice4 == null) {
                    logger(logger_caller, "Failed: DB Data lost its integrity", logger_args);
                    res.sendStatus(400);
                    return;
                }

                res.status(200).send({
                    "qa_id": results[0].qa_id,
                    "question": results[0].question,
                    "answer": results[0].answer,
                    "choices": [
                        choice1,
                        choice2,
                        choice3,
                        choice4
                    ]
                });
            });
        } else {
            res.status(200).send({
                "qa_id": results[0].qa_id,
                "question": results[0].question,
                "answer": results[0].answer
            });
        }

        logger(logger_caller, "Success", logger_args);
        return;
    });
});

module.exports = router;