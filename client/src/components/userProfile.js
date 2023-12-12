import {showDate, questions, answers, tags, user, users, getAnswer} from './global.js'
import QuestionPage from './questionPage.js';
import TagPage from './tagPage.js';

var changePage;
export default function UserProfile(props){
    changePage = props.changePage;
    console.log("Questions Answered", questionsAnswered(props.user))
    return(
        <div className = "scrollPage" style = {{overflowX: "hidden"}}>
            <div style = {{display: "flex"}}>
                <h1 style = {{marginLeft: "5%"}}>{props.user.username}</h1>
                <h1 style = {{marginLeft: "20%"}}>{"Reputation: "+props.user.reputation}</h1>
                <h1 style = {{marginLeft: "20%"}}>{"Joined: "+showDate(new Date(props.user.joinDate))}</h1>
            </div>
            {props.user.admin && <h4>Users</h4>}
            {props.user.admin && <UserBoxes/>}
            <h4>Questions</h4>
            <QuestionBoxes user = {props.user}/>
            <div style = {{padding: "20px"}}>
                <button onClick = {() => changePage(<TagPage user = {props.user} changePage = {changePage}/>,2)} className = "blueButton">Tags Created</button>
                <button onClick = {() => showQuestionsAnswered(props.user)} style = {{marginLeft: "20px"}}className = "blueButton">Questions Answered</button>
            </div>
        </div>
    )
}
function UserBoxes(props){
    return(
        <div style = {{borderBottom: "black dotted", widths: "100%"}}>
            {users.map(aUser => <UserBox user = {aUser}/>)}
        </div>
    )
}

function UserBox(props){
    return(
        <div style = {{padding: "10px", borderTop: "black dotted", width: "100%"}}>
            {props.user.username}
            <button onClick = {() => changePage(<UserProfile user = {props.user} changePage = {changePage}/>)} style = {{marginLeft: "10px"}}>View Profile</button>
            <button style = {{marginLeft: "10px"}}>Delete User</button>
        </div>
    )
}
function QuestionBoxes(props){
    let userQuestions = questions.filter(question => question.postBy === props.user._id)
    return(
        <div style = {{borderBottom: "black dotted", width: "100%"}}>
            {userQuestions.map(question => <QuestionBox title = {question.title}/>)}
        </div>
    )
}

function QuestionBox(props){
    return(
        <div style = {{padding: "10px", borderTop: "black dotted", width: "100%"}}>
            {props.title}
            <button style = {{marginLeft: "10px"}}>Edit</button>
            <button style = {{marginLeft: "10px"}}>Delete</button>
        </div>
    )
}

function showQuestionsAnswered(user){
    changePage(<QuestionPage title = {user.username+" answered"} questionList = {questionsAnswered(user)} mode = {1} profile = {user} changePage = {changePage}/>,1)
}
function questionsAnswered(user){
    return questions.filter(question => didAnswer(question, user));
}

function didAnswer(question, user){
    return question.answers.map(ansId => getAnswer(ansId)).filter(answer => answer.postBy === user._id).length > 0;
}