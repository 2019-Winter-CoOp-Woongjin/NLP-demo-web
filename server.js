var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", require("./routers/api"));
app.use("/", function(req, res, next) {
    res.render("index");
});

const PORT = 80;
app.listen(PORT, function() {
    console.log("Express server started on port " + PORT);
});