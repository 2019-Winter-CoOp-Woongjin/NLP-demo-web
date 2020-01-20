module.exports = function (caller, msg, args) {
    console.log("[%s] %s - %j\n", caller, msg, args);
}