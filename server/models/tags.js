var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {type: String},
    creator:  {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Tag', TagSchema);