// Application server
const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
var cors = require('cors');
const port = 8000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
      secret: "supersecret difficult to guess string",
      cookie: { maxAge: 24 * 60 * 60 * 1000 },
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/fake_so'})
    })
  );

let Question = require('./models/questions.js');
let Answer = require('./models/answers.js');
let Tag = require('./models/tags.js');
let Comment = require('./models/comments.js');
let User = require('./models/users.js');

let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
    console.log('Connected to database');
});

app.get('/getAllQuestions', (req, res) => {
    Question.find()
        .then(questions => {
            res.json(questions);
        })
        .catch(err => {
            console.error("Error:", err);
         });
})

app.get('/getAllAnswers', (req, res) => {
    Answer.find()
        .then(answers => {
            res.json(answers);
        })
        .catch(err => {
            console.error("Error:", err);
         });
})

app.get('/getAllTags', (req, res) => {
    Tag.find()
        .then(tags => {
            res.json(tags);
        })
        .catch(err => {
            console.error("Error:", err);
         });
});

app.get('/getAllComments', (req, res) => {
    Comment.find()
        .then(comments => {
            res.json(comments);
        })
        .catch(err => {
            console.error("Error:", err);
         });
});

app.get('/getAllUsers', (req, res) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.error("Error:", err);
         });
});

app.post('/addQuestion', async (req, res) => {
    let question = new Question(req.body);
    await question.save();
    res.send();
})

app.post('/addTag', async (req, res) => {
    let tag = new Tag(req.body);
    await tag.save();
    res.send();
})

app.post('/addAnswer', async (req, res) => {
    let answer = new Answer(req.body);
    await answer.save();
    res.json({"ansId": answer._id});
})

app.post('/addUser', async (req, res) => {
    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let passwordHash = await bcrypt.hash(req.body.password, salt);
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: passwordHash
    });
    await user.save();
    res.send();
})

app.post('/incrementViews', async (req, res) => {
    await Question.findByIdAndUpdate(req.body._id,{$inc:{views:1}});
    res.send();
})

app.post('/addAnsId', async (req, res) => {
    let newQuestion = await Question.findByIdAndUpdate(req.body.qid,{$push:{answers: req.body.aid.ansId}},{new: true});
    res.json({"newQuestion": newQuestion});
})

app.get("/", async (req, res) => {
    res.json({"user": req.session.user});
});

app.post('/login', async(req, res) => {
    let user = (await User.find({email: req.body.email}).exec())[0];
    let verdict = await bcrypt.compare(req.body.password, user.passwordHash);
    if(verdict){
        req.session.user = user.username;
        res.send();
    }
    else{
        res.status(401).json({"Error": "Incorrect password"});
    }
})

app.post("/logout", async (req, res) => {
    req.session.destroy(err => {
      res.redirect("/")
    });
  });

app.post("/upvoteQuestion", async(req, res) => {
    let newUpvoteId = req.body.uid;
    let questionId = req.body.qid
    let question = await Question.findById(questionId);
    question.upVotes.push(newUpvoteId);
    let postById = question.postBy;
    await question.save();
    let postBy = await User.findById(postById);
    postBy.reputation += 10;
    await postBy.save();
    res.send();
})

app.post("/unUpvoteQuestion", async(req, res) => {
    let newUpvoteId = req.body.uid;
    let questionId = req.body.qid;
    let question = await Question.findById(questionId);
    let index = question.upVotes.indexOf(newUpvoteId);
    question.upVotes.splice(index,1);
    let postById = question.postBy;
    await question.save();
    let postBy = await User.findById(postById);
    postBy.reputation -= 10;
    await postBy.save();
    res.send();
})

app.post("/downvoteQuestion", async(req, res) => {
    let newDownvoteId = req.body.uid;
    let questionId = req.body.qid;
    let question = await Question.findById(questionId);
    question.downVotes.push(newDownvoteId);
    let postById = question.postBy;
    await question.save();
    let postBy = await User.findById(postById);
    postBy.reputation -= 5;
    await postBy.save();
    res.send();
})

app.post("/unDownvoteQuestion", async(req, res) => {
    let newDownvoteId = req.body.uid;
    let questionId = req.body.qid
    let question = await Question.findById(questionId);
    let index = question.downVotes.indexOf(newDownvoteId);
    question.downVotes.splice(index,1);
    let postById = question.postBy;
    await question.save();
    let postBy = await User.findById(postById);
    postBy.reputation += 5;
    await postBy.save();
    res.send();
})

app.post("/upvoteAnswer", async (req, res) => {
    let newUpvoteId = req.body.uid;
    let answerId = req.body.aid;
    let answer = await Answer.findById(answerId);
    answer.upVotes.push(newUpvoteId);
    let postById = answer.postBy;
    await answer.save();
    let postBy = await User.findById(postById);
    postBy.reputation += 5;
    await postBy.save();
    res.send();
});

app.post("/unUpvoteAnswer", async (req, res) => {
    let newUpvoteId = req.body.uid;
    let answerId = req.body.aid;
    let answer = await Answer.findById(answerId);
    let index = answer.upVotes.indexOf(newUpvoteId);
    answer.upVotes.splice(index, 1);
    let postById = answer.postBy;
    await answer.save();
    let postBy = await User.findById(postById);
    postBy.reputation -= 5;
    await postBy.save();
    res.send();
});

app.post("/downvoteAnswer", async (req, res) => {
    let newDownvoteId = req.body.uid;
    let answerId = req.body.aid;
    let answer = await Answer.findById(answerId);
    answer.downVotes.push(newDownvoteId);
    let postById = answer.postBy;
    await answer.save();
    let postBy = await User.findById(postById);
    postBy.reputation -= 10;
    await postBy.save();
    res.send();
});

app.post("/unDownvoteAnswer", async (req, res) => {
    let newDownvoteId = req.body.uid;
    let answerId = req.body.aid;
    let answer = await Answer.findById(answerId);
    let index = answer.downVotes.indexOf(newDownvoteId);
    answer.downVotes.splice(index, 1);
    let postById = answer.postBy;
    await answer.save();
    let postBy = await User.findById(postById);
    postBy.reputation += 10;
    await postBy.save();
    res.send();
});
app.listen(port, () => {
    console.log(`Fake Stack Overflow server listening on port ${port}`)
  })

  app.post("/upvoteComment", async (req, res) => {
    let commentId = req.body.cid;
    let newUpvoteId = req.body.uid;
    let comment = await Comment.findById(commentId);
    comment.upVotes.push(newUpvoteId);
    await comment.save();
    res.send();
});

app.post("/unUpvoteComment", async (req, res) => {
    let commentId = req.body.cid;
    let newUpvoteId = req.body.uid;
    let comment = await Comment.findById(commentId);
    let index = comment.upVotes.indexOf(newUpvoteId);
    comment.upVotes.splice(index, 1);
    await comment.save();
    res.send();
});

app.post("/commentQuestion", async (req, res) => {
    let comment = req.body.comment;
    let qid = req.body.qid;
    let newComment = new Comment(comment);
    newComment.save();
    let question = await Question.findById(qid);
    question.comments.push(newComment._id);
    question.save();
    res.send();
});

app.post("/commentAnswer", async (req, res) => {
    let comment = req.body.comment;
    let aid = req.body.aid;
    let newComment = new Comment(comment);
    newComment.save();
    let answer = await Answer.findById(aid);
    answer.comments.push(newComment._id);
    answer.save();
    res.send();
})