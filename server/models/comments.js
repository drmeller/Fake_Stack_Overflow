var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    text: {type: String},
    postBy: {type: Schema.Types.ObjectId, ref: 'User'},
    postDate: {type: Date, default: Date.now},
    upVotes: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
});

module.exports = mongoose.model('Comment', CommentSchema);