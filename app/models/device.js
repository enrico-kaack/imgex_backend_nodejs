// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose models and pass it using module.exports
module.exports = mongoose.model('Device', new Schema({
    device_name: String,
    device_type: String,
    push_able: Boolean,
    device_reg_id: String,
    key: String
}));