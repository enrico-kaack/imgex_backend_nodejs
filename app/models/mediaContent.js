// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose models and pass it using module.exports
module.exports = mongoose.model('MediaContent', new Schema({
    media_location: String,
    thumb_location: String,
    title: String,
    uploaded: Date,
    author: {type: Schema.Types.ObjectId, ref: "User"}
}));