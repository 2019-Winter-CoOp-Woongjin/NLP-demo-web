var express = require("express");
var router = express.Router();
var request = require("request");
var logger = require("../global/logger");

router.post("/", function (req, res, next) {
    var logger_caller = "/api/analyze(POST)";
    var logger_args = { "text": req.body.text, "qType": req.body.q_type, "question": req.body.question, "answer": req.body.answer };

    var text = req.body.text;
    var qType = req.body.q_type;
    var question = req.body.question;
    var answer = req.body.answer;

    request.post({
        headers: {
            "Content-Type": "application/json"
        },
        uri: "http://localhost:10000/",
        method: "POST",
        body: {
            "text": text,
            "q_type": qType,
            "question": question,
            "answer": answer
        },
        json: true
    }, function(err, res_from_python, result) {
        if(res_from_python.statusCode == 200) {
            logger(logger_caller, "Success", logger_args);
            res.status(200).send(result);
        } else {
            console.log(result);
            logger(logger_caller, "Fail - " + res_from_python.statusCode, logger_args);
            res.status(400);
        }
    });
});

module.exports = router;