var express = require("express");
var router = express.Router();
var siteconfig = require("../config/site");

var logger = require("../global/logger");

router.use("/", function (req, res, next) {
    res.render("qhistory");
});

module.exports = router;