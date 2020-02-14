var moment = require("moment-timezone");

module.exports = function (caller, msg, args) {
    moment.tz.setDefault("Asia/Seoul");
    var date = moment().format("YYYY-MM-DD HH:mm:ss");
    if (Object.keys(args).length === 0) {
        console.log("\x1b[32m[%s] [%s] \x1b[0m%s\n", date, caller, msg);
    } else {
        console.log("\x1b[32m[%s] [%s] \x1b[0m%s - %j\n", date, caller, msg, args);
    }
    
}