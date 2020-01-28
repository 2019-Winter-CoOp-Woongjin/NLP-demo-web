var express = require("express");
var router = express.Router();
var siteconfig = require("../../config/site");
var Query = require("../../config/dbschema-tq_similarity_checker-query");

var logger = require("../../global/logger");

router.delete("/:id", function (req, res, next) {
    var logger_caller = "/api/TQ-Similarity-Checker/db(DELETE)";
    var logger_args = { id: req.params.id };

    var id = req.params.id;

    Query.remove({_id: id }, function (err, results) {
        if (err) {
            logger(logger_caller, "Failed", logger_args);
            console.err(err);
            res.sendStatus(400);
            return;
        }

        logger(logger_caller, "Success", logger_args);
        res.sendStatus(200);
        return;
    });
});

module.exports = router;