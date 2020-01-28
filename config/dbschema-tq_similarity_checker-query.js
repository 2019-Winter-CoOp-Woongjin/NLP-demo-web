var mongoose = require("mongoose");

var TQ_Similarity_Checker__QuerySchema = new mongoose.Schema({
    "version": String,
    "text": String,
    "paragraph": Number,
    "question": String,
    "answer": String,
    "query_result": String
}, {
    timestamps: true
});

module.exports = mongoose.model("TQ_Similarity_Checker-Query", TQ_Similarity_Checker__QuerySchema);