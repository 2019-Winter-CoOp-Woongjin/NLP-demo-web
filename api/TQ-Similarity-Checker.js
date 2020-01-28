var express = require("express");
var router = express.Router();
var siteconfig = require("../config/site");
var Query = require("../config/dbschema-tq_similarity_checker-query");

var logger = require("../global/logger");

var python = require("python-shell");

router.use("/db", require("./TQ-Similarity-Checker/db"));

router.post("/", function (req, res, next) {
    var logger_caller = "/api/TQ-Similarity-Checker(POST)";
    var logger_args = { "version": req.body.version, "text": req.body.text, "paragraph": req.body.paragraph, "question": req.body.question, "answer": req.body.answer };
    
    var version = req.body.version;
    var text = req.body.text;
    var paragraph = req.body.paragraph;
    var question = req.body.question;
    var answer = req.body.answer;

    var pyshell = new python.PythonShell(version + ".py", {
        mode: "text",
        pythonPath: "/home/twttkang/anaconda3/envs/python/bin/python",
        scriptPath: "api/TQ-Similarity-Checker",
        args: [text, paragraph, question, answer]
    });

    var result = "";
    pyshell.on("message", function (message) {
        console.log("From python: " + message);
        result += message + "\n";
    });

    pyshell.end(function (err) {
        if (err) throw err;

        var newQuery = new Query();
        newQuery.version = version;
        newQuery.text = text;
        newQuery.paragraph = Number(paragraph);
        newQuery.question = question;
        newQuery.answer = answer;
        newQuery.query_result = result;

        newQuery.save(function(err) {
            if(err) {
                console.error(err);
            }
        });

        logger(logger_caller, "Success", logger_args);
        res.status(200).json({
            "result": result
        });
        return;
    });

    return;
});

module.exports = router;