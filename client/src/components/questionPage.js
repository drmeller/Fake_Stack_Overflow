import {questions, updateQuestions, showDate, lastAnswered, findUser, user, TagBoxes} from './global.js';
import QuestionForm from './questionForm.js';
import AnswerPage from './answerPage.js';
import axios from 'axios';
import React, {useState, useEffect} from 'react';

var changePage;
export default function QuestionPage(props){
    changePage = props.changePage;
    let questionDisplay = [];
    let [questionStart, setQuestionStart] = useState(0);

    if(props.mode === 1) questionDisplay = newestQuestions(props.questionList);
    if(props.mode === 2) questionDisplay = activeQuestions(props.questionList);
    if(props.mode === 3) questionDisplay = unAnsweredQuestions(props.questionList);

    let questionHeight = '80%';
    if(questionDisplay.length > 5) questionHeight = '75%';
    useEffect(() => {
        if(questionDisplay.length > 5){
            if(questionStart < 5){
                document.getElementById("questionPrev").disabled = true;
            }
            else{
                document.getElementById("questionPrev").disabled = false;
            }
            if(questionDisplay.length - questionStart <= 5){
                document.getElementById("questionNext").disabled = true;
            }
            else{
                document.getElementById("questionNext").disabled = false;
            }
        }

    })

    return(
        <div id = "questionPage" className = "page">
            <div id = "pageTop">
                <h2 id = "pageTitle">{props.title}</h2>
                {user && <button id = "addQuestion" className = "blueButton" onClick = {() => props.changePage(<QuestionForm changePage = {props.changePage}/>)}>Ask Question</button>}
            </div>
            <div id = "pageMiddle">
                <p id = "numQuestions">{questionDisplay.length + " questions"}</p>
                <button id = "newest" className = {props.mode === 1 ? "active" : "inactive"} onClick = {() => threeButtons(props.title,props.questionList,1)}> Newest</button>
                <button id = "active" className = {props.mode === 2 ? "active" : "inactive"} onClick = {() => threeButtons(props.title,props.questionList,2)}> Active</button>
                <button id = "unAnswered" className = {props.mode === 3 ? "active" : "inactive"} onClick = {() => threeButtons(props.title,props.questionList,3)}>  Unanswered</button>
            </div>
            <h2 id = "noQuestionsFound" style = {questionDisplay.length?{display: "none"}:{display: "block"}}>No Questions Found</h2>
            <div id = "questionBoxes" style = {{height: questionHeight}}>
                {questionDisplay.slice(questionStart, questionStart+5).map(
                    (question, index) => <QuestionBox key = {index} question = {question} changePage = {props.changePage}/>
                )}
            </div>
            {questionDisplay.length > 5 && <button id = "questionPrev" onClick = {() => setQuestionStart(start => start-5)} style = {{marginLeft: '45%'}}>Prev</button>}
            {questionDisplay.length > 5 && <button id = "questionNext" onClick = {() => setQuestionStart(start => start+5)} >Next</button>}
        </div>
    )
}

//Sub components

function QuestionBox(props){
    async function questionClick(){
        await axios.post('http://localhost:8000/incrementViews', props.question, {headers: {'Content-Type': 'application/json'}});
        let res = await axios.get('http://localhost:8000/getAllQuestions');
        updateQuestions(res.data);
        let question = questions.filter(question => props.question._id === question._id)[0];
        props.changePage(<AnswerPage question = {question} changePage = {props.changePage}/>);
    }
    return(
        <div className = "questionBox">
            <div className = "QBtop">
                <div className = "QBtopLeft">
                    <p className = "answerCount">{"answers: "+props.question.answers.length}</p>
                    <p className = "viewCount">{"views: "+props.question.views}</p>
                    <p className = "viewCount">{"votes: "+(props.question.upVotes.length-props.question.downVotes.length)}</p>
                </div>
                <div className = "questionTitle" onClick = {() => questionClick()}>{props.question.title}
                <br></br>
                <div className = "questionSummary">{props.question.summary}</div>
                </div>
                <div className = "qbTopRight">
                    <span style = {{color: "red", marginLeft: "30px"}}>{findUser(props.question.postBy).username}</span>
                    <span>{" asked "+showDate(new Date(props.question.postDate))}</span>
                </div>
            </div>
            <div className = "QBbottom">
                <div className = "tagBoxes">
                    <TagBoxes tags = {props.question.tags}/>
                </div>
            </div>
        </div>
    )
}

//functions for reacting to events

let threeButtons = function(title, questionList, mode){
    changePage(<QuestionPage title = {title} questionList = {questionList} changePage = {changePage} mode = {mode}/>,1);
}

let newestQuestions = function(questionList){
    let result = [...questionList];
    result.sort((a,b)=>new Date(b.postDate)-new Date(a.postDate));
    return result;
  }
let activeQuestions = function(questionList){
    let result = [...questionList];
    result.sort((a,b)=>lastAnswered(b)-lastAnswered(a));
    return result;
  }
let unAnsweredQuestions = function(questionList){
    return questionList.filter(question => (!question.answers.length));
  }