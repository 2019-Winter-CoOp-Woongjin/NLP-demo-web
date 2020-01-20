var express = require("express");
var router = express.Router();
var siteconfig = require("../config/site");

var logger = require("../global/logger");

var python = require("python-shell");

router.post("/", function (req, res, next) {
    var logger_caller = "/api/RQ-Similarity-Checker(POST)";
    var logger_args = { "version": req.body.version, "reference": req.body.reference, "question": req.body.question };
    
    var version = req.body.version;
    var reference = req.body.reference;
    var question = req.body.question;

    var pyshell = new python.PythonShell(version + ".py", {
        mode: "text",
        pythonPath: "/home/twttkang/anaconda3/envs/python/bin/python",
        scriptPath: "api/RQ-Similarity-Checker",
        args: [reference, question]
    });

    var result = "";
    pyshell.on("message", function (message) {
        console.log("From python: " + message);
        result += message + "<br/>";
    });

    pyshell.end(function (err) {
        if (err) throw err;

        logger(logger_caller, "Success", logger_args);
        res.status(200).json({
            "result": result
        });
        return;
    });

    return;
});

module.exports = router;