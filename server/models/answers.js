var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    text: {type: String},
    postBy: {type: Schema.Types.ObjectId, ref: 'User'},
    postDate: {type: Date, default: Date.now},
    upVotes: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    downVotes: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', default: []}],
});

module.exports = mongoose.model('Answer', AnswerSchema);