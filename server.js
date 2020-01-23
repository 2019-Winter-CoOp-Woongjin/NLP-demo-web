var http = require("http");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/home", require("./routers/home"));
app.use("/demo", require("./routers/demo"));
app.use("/api", require("./routers/api"));
app.use("/qhistory", require("./routers/qhistory"));

const PORT = 80;
app.listen(PORT, function() {
    console.log("Express server started on port " + PORT);
});