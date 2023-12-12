var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        joinDate: {type: Date, default: Date.now},
        reputation: {type: Number, default: 0},
        admin: {type: Boolean, default: false}
    }
)

module.exports = mongoose.model('User', UserSchema);