var http = require("http");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(function() {
    console.log("DB Connection Success!");
})
.catch(function(err) {
    console.log("DB Connection Failed");
    console.log(err);
});

app.use("/home", require("./routers/home"));
app.use("/demo", require("./routers/demo"));
app.use("/api", require("./routers/api"));
app.use("/qhistory", require("./routers/qhistory"));

const PORT = 80;
app.listen(PORT, function() {
    console.log("Express server started on port " + PORT);
});