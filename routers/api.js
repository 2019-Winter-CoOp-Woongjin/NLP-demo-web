var express = require("express");
var router = express.Router();

router.use("/RQ-Similarity-Checker", require("../api/RQ-Similarity-Checker"));

module.exports = router;