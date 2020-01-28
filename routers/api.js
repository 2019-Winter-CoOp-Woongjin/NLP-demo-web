var express = require("express");
var router = express.Router();

router.use("/TQ-Similarity-Checker", require("../api/TQ-Similarity-Checker"));

module.exports = router;