var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        title: {type: String, maxlength: 50},
        summary: {type: String, maxlength: 140},
        text: {type: String},
        tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
        answers: [{type: Schema.Types.ObjectId, ref: 'Answer', default: []}],
        postBy: {type: Schema.Types.ObjectId, ref: 'User'},
        postDate: {type: Date, default: Date.now},
        views: {type: Number, default: 0},
        upVotes: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
        downVotes: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment', default: []}],
    }
);

module.exports = mongoose.model('Question', QuestionSchema);