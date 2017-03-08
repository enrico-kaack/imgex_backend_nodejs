// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose models and pass it using module.exports
module.exports = mongoose.model('Group', new Schema({
    name: String,
    members: [{_id: String, admin: Boolean}],
    media_content: [{type: Schema.Types.ObjectId, ref: "MediaContent"}]
}));