var express = require("express");
var router = express.Router();
var siteconfig = require("../config/site");
var Query = require("../config/dbschema-tq_similarity_checker-query");
var moment = require("moment-timezone");

var logger = require("../global/logger");

function formatISO8601InKR(str) {
    var s = str.split("T");
    var s0 = s[0].split("-");
    var s1 = (s[1].split("+"))[0];

    return s0[0] + "년 " + s0[1] + "월 " + s0[2] + "일 " + s1;
}

router.use("/", function (req, res, next) {
    Query.find(function(err, qresults) {
        if(err) {
            console.err(err);
        }

        results = [];
        for(var i = 0; i < qresults.length; i++) {
            results.push({
                "id": qresults[i]["_id"],
                "version": qresults[i]["version"],
                "createdAt": formatISO8601InKR(moment(qresults[i]["createdAt"]).tz("Asia/Seoul").format()),
                "text": qresults[i]["text"],
                "paragraph": qresults[i]["paragraph"],
                "question": qresults[i]["question"],
                "answer": qresults[i]["answer"],
                "query_result": qresults[i]["query_result"]
            });
        }

        res.render("qhistory", {
            "results__TQ_Similarity_Chker": results
        });
    });
});

module.exports = router;