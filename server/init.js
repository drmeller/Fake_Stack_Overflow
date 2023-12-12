// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

// Sample command for starting init.js:
// node init.js dmeller dannimeller@gmail.com password

var bcrypt = require('bcryptjs');

let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let User = require('./models/users');
let Comment = require('./models/comments');

let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function questionCreate(title, summary, text, tags, postBy, upVotes, downVotes, answers, comments, views){
    let question = new Question({title: title, summary: summary, text: text, tags: tags, postBy: postBy, upVotes: upVotes, downVotes: downVotes, answers: answers, comments: comments, views: views});
    let savedQuestion = await question.save();
    return savedQuestion;
}

async function answerCreate(text, postBy, upVotes, downVotes, comments){
    let answer = new Answer({text: text, postBy: postBy, upVotes: upVotes, downVotes: downVotes, comments: comments});
    let savedAnswer = await answer.save();
    return savedAnswer;
}

async function tagCreate(name, creator) {
    let tag = new Tag({ name: name, creator: creator});
    let savedTag = await tag.save();
    return savedTag;
}

async function commentCreate(text, postBy, upVotes){
    let comment = new Comment({text: text, postBy: postBy, upVotes: upVotes});
    let savedComment = await comment.save();
    return savedComment;
}
async function userCreate(username, email, password, reputation, admin){
    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let passwordHash = await bcrypt.hash(password, salt);
    let user = new User({username: username, email: email, passwordHash: passwordHash, reputation: reputation, admin: admin});
    let savedUser = await user.save();
    return savedUser;
}

const populate = async () => {

    //Users
    let Alice = await userCreate('alice_j','alice.j@example.com','password',100);
    let Bob = await userCreate('bob_s','bob.smith@example.com','password',100);
    let Carol = await userCreate('carol_d','carol.d@example.com','password',100);
    let David = await userCreate('david_w','david.white@example.com','password',100);
    let Emma = await userCreate('emma_b','emma.brown@example.com','password',100);
    let Frank = await userCreate('frank_m','frank.m@example.com','password',100);
    let Grace = await userCreate('grace_t','grace.turner@example.com','password',100);
    let Harry = await userCreate('harry_l','harry.lee@example.com','password',100);
    let Irene = await userCreate('irene_m','irene.martinez@example.com','password',100);
    let Jack = await userCreate('jack_r','jack.robinson@example.com','password',100);
    let admin = await userCreate(process.argv[2],process.argv[3],process.argv[4],100,true);

    //Tags
    let react = await tagCreate('react',Alice);
    let javascript = await tagCreate('javascript',Alice);
    let androidStudio = await tagCreate('android-studio',Bob);
    let sharedPreferences = await tagCreate('shared-preferences',Bob);

    //Comments
    let c1a = await commentCreate(
        'Excellent explanation! Understanding the underlying concepts of React Router and its integration with history can be crucial for debugging navigation-related issues.',
        Alice, [Alice,Carol,David,Grace]
    );
    let c1b = await commentCreate(
        'This approach can indeed lead to cleaner code and more control over navigation history. Just ensure you handle it consistently across your components.',
        Jack, [Carol]
    );
    let c2 = await commentCreate(
        'Handling fragment visibility is a common practice. The crash during theme changes might be related to the lifecycle management of your fragments. Have you considered using ViewModel to persist data during configuration changes?',
        Irene, [Carol, Emma, Grace, Harry]
    );
    let c2a = await commentCreate(
        'This advice is crucial, especially during configuration changes. Applying changes in the background can help prevent UI freezes or crashes.',
        Frank, [Carol, Emma, Grace, Irene]
    )
    let c2b = await commentCreate(
        'Using a dedicated class for handling preferences is a good practice. Ensure your context is valid and the keys/values are correctly set.',
        Emma, [David]
    );
    let c2c = await commentCreate(
        'Sometimes simplicity is key! If your solution works for you, that\'s what matters most. Consider sharing your implementation for others who might prefer a straightforward approach.',
        Carol, [Bob]
    );

    //Answers
    let a1a = await answerCreate(
        'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 
        Bob, [Carol, David, Emma, Grace], [Alice], [c1a]
    );
    let a1b = await answerCreate(
        'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
        Carol, [Alice, Grace],[],[c1b]
    );
    let a2a = await answerCreate(
        'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
        Alice,[Carol,Emma,Grace,Harry],[],[c2a]
    );
    let a2b = await answerCreate(
        'YourPreference yourPreference = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
        Carol,[Bob,Harry],[],[c2b]
    );
    let a2c = await answerCreate(
        'I just found all the above examples just too confusing, so I wrote my own.',
        Emma, [Bob, Harry]
    );

    //Questions
    let q1 = await questionCreate(
        "Programmatically navigate using React router",
        "Question Summary",
        "The alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.",
        [react, javascript],
        Alice,
        [Bob, Carol, David, Emma, Grace],
        [Frank],
        [a1a, a1b],
        [],
        126
    );

    let q2 = await questionCreate(
        "Android Studio save string shared preference",
        "Android Studio save string shared preference, start activity and load the saved string",
        "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time I switch to a different view. I just hide/show my fragments depending on the icon selected. The problem I am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what I am using to refrain them from being recreated.",
        [androidStudio,sharedPreferences, javascript],
        Bob,
        [Alice, Carol, Emma, Grace, Harry],
        [David, Frank],
        [a2a, a2b, a2c],
        [c2],
        79
    );
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');