var express = require("express");
var router = express.Router();

router.use("/load-rand-text", require("../api/load-rand-text"));
router.use("/load-rand-qa", require("../api/load-rand-qa"));
router.use("/analyze", require("../api/analyze"));
//router.use("/TQ-Similarity-Checker", require("../api/TQ-Similarity-Checker"));

module.exports = router;