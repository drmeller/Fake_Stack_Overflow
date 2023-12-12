import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {answers, updateAnswers, showDate, makeLinks, user, users, updateUsers, questions, updateQuestions, findUser, TagBoxes, comments, updateComments} from './global';
import QuestionForm from './questionForm';
import AnswerForm from './answerForm';

let changePage, question;
export default function AnswerPage(props){
    changePage = props.changePage;
    question = props.question;
    let[answerStart, setAnswerStart] = useState(0);
     //sort answers
    let sortedAnswers = [];
    for(let answer of props.question.answers){
        sortedAnswers.push(getAnswer(answer));
    }
    sortedAnswers.sort((a,b)=> new Date(b.postDate)- new Date(a.postDate));
    let answerBoxHeight;
    if(user){
        answerBoxHeight = "45%";
        if(sortedAnswers.length > 5){
            answerBoxHeight = "40%";
        }
    }
    else{
        answerBoxHeight = "55%";
        if(sortedAnswers.length > 5){
            answerBoxHeight = "50%";
        }
    }
    useEffect(() => {
        if(sortedAnswers.length > 5){
            if(answerStart < 5){
                document.getElementById("answerPrev").disabled = true;
            }
            else{
                document.getElementById("answerPrev").disabled = false;
            }
            if(sortedAnswers.length - answerStart < 5){
                document.getElementById("answerNext").disabled = true;
            }
            else{
                document.getElementById("answerNext").disabled = false;
            }
        }

    })
    return(
        <div id = "answerPage" className = "page">
            <div id = "answerPageTop">
                <h3 id = "numAnswers">{props.question.answers.length+" answers"}</h3>
                <h3 id = "titleOfQuestion">{props.question.title}</h3>
                {user && user.reputation >= 50 &&<button id = "askQuestion2" className = "blueButton" onClick = {() => props.changePage(<QuestionForm changePage = {props.changePage}/>)}>Ask Question</button>}
            </div>
            <div id = "answerPageMiddle">
                <div>
                    <h3 id = "numViews">{props.question.views + " views"}</h3>
                    <div id = "questionVotes">
                        <UpVoteButton size = {1} thing = {props.question} action = {() => upvoteQuestion(props.question)}/>
                        <h3 style = {{margin: 0}}>{props.question.upVotes.length - props.question.downVotes.length + " votes"}</h3>
                        <DownVoteButton thing = {props.question}  action = {() => downvoteQuestion(props.question)}/>
                    </div>
                </div>
                <p id = "textOfQuestion">{makeLinks(props.question.text)}</p>
                <div id = "questionData">
                    <p id = "questionAsker" style = {{color: "red"}}>{findUser(props.question.postBy).username}</p>
                    <p id = "questionAsked">{"asked "+showDate(new Date(props.question.postDate))}</p>
                </div>
            </div>
            <div id = "answerPageUnder">
                <div style = {{marginLeft: "10%"}}> <TagBoxes tags = {props.question.tags}/></div>
            </div>
            {(user || question.comments.length > 0) && <CommentBoxes thing = {question} action = {commentQuestion}/>}
            <div id = "answerBoxes" style = {{height: answerBoxHeight}}>
            {sortedAnswers.slice(answerStart, answerStart+5).map(
                    (answer, index) => <AnswerBox key = {index} answer = {answer}/>
                )}
            </div>
            <div>
                {sortedAnswers.length > 5 && <button id = "answerPrev" onClick = {() => setAnswerStart(start => start-5)} style = {{marginLeft: '45%'}}>Prev</button>}
                {sortedAnswers.length > 5 && <button id = "answerNext" onClick = {() => setAnswerStart(start => start+5)} >Next</button>}
            </div>
            <div>{user && user.reputation >= 50 &&<button id = "ansButton" className = "blueButton" onClick = {() => props.changePage(<AnswerForm question = {props.question} changePage = {props.changePage}/>)}>Answer Question</button>}</div>
            <div style = {{height: "20px"}}></div>
        </div>
    )
}

//subComponents

let CommentBoxes = function(props){
    let sortedComments = props.thing.comments.sort((a,b)=> new Date(findComment(b).postDate)- new Date(findComment(a).postDate));
    let [commentStart, setCommentStart] = useState(0);
    let [commentValue, setCommentValue] = useState('');
    let commentPrev = <button onClick = {() => setCommentStart(start => start-3)}>Prev</button>;
    let commentNext = <button onClick = {() => setCommentStart(start => start+3)}>Next</button>;
    let commentField = <input 
        className = "commentField" 
        placeholder = "Add comment" 
        onChange={(event) => setCommentValue(event.target.value)}
        onKeyUp = {(event) => props.action(event, props.thing, cError, commentValue)}>
        </input>;
    let cError = <div className = "cError">Error</div>
    // useEffect(() => {
    //     if(sortedComments.length > 3){
    //         if(commentStart < 3){
    //             commentPrev.disabled = true;
    //         }
    //         else{
    //             commentPrev.disabled = false;
    //         }
    //         if(sortedComments.length - commentStart < 3){
    //             commentNext.disabled = true;
    //         }
    //         else{
    //             commentNext.disabled = false;
    //         }
    //     }
    // })
    return(
        <div>
            <div className = "commentBox" style = {{marginTop: "5px"}}>
                {sortedComments.length > 3 && commentPrev}
                {sortedComments.length > 3 && commentNext}
                {sortedComments.slice(commentStart, commentStart+3).map(
                    (comment, index) => <CommentBox key = {index} comment = {findComment(comment)}/>
                )}
                {user && commentField}
            </div>
            {cError}
        </div>
    )
}

let CommentBox = function(props){
    return(
    <div className = "comment">
        <div style = {{marginLeft: "10px", marginTop: "7px"}}>{props.comment.upVotes.length}</div>
        <div style = {{marginTop: "10px", marginLeft: "0px"}}>
            <UpVoteButton size = {.7} thing = {props.comment} action = {() => upvoteComment(props.comment)}/>
        </div>
        <p style = {{margin: "5px"}}>{props.comment.text + " - "+findUser(props.comment.postBy).username}</p>
    </div>
    )
}

let AnswerBox = function(props){
    return(
        <div style = {{borderBottom: "black dotted"}}>
            <div className = "answerBox">
                <div className = "answerVotes">
                    <UpVoteButton size = {1} thing = {props.answer} action = {() => upvoteAnswer(props.answer)}/>
                    <h3 style = {{margin: 0}}>{props.answer.upVotes.length - props.answer.downVotes.length + " votes"}</h3>
                    <DownVoteButton thing = {props.answer} action = {() => downvoteAnswer(props.answer)}/>
                </div>
                <div className = "answerText">{makeLinks(props.answer.text)}</div> 
                <div className = "answerData">
                    <p className = "ansBy">{findUser(props.answer.postBy).username}</p>
                    <p className = "ansDate">{"answered "+showDate(new Date(props.answer.postDate))}</p>
                </div>
            </div>
            {(user || props.answer.comments.length > 0) && <CommentBoxes thing = {props.answer} action = {commentAnswer}/>}
        </div>
    )
}

let UpVoteButton = function(props){
    let color;
    let size = props.size;
    let marginLeft = size === 1 ? "15px" : "0px";
    if (!user || user.reputation < 50){
        color = "lightgray";
    }
    else if(props.thing.upVotes.includes(user._id)){
        color = "blue";
    }
    else{
        color = "black";
    }
    return(
        <div className = "upvote" style = {{marginLeft: marginLeft, borderLeft: (15*size)+"px solid transparent", borderRight: (15*size)+"px solid transparent", borderBottom: (20*size)+"px solid "+color}} onClick = {() => props.action()}>
        </div>
    )
}

let DownVoteButton = function(props){
    let color;
    if (!user || user.reputation < 50){
        color = "lightgray";
    }
    else if(props.thing.downVotes.includes(user._id)){
        color = "blue";
    }
    else{
        color = "black";
    }
    return(
        <div className = "downvote" style = {{marginLeft: "15px", borderTop: "20px solid "+color}} onClick = {() => props.action()}>
        </div>
    )
}

//Helper functions

let upvoteQuestion = async function(question){
    if(user && user.reputation >= 50){
        if(question.upVotes.includes(user._id)){
            await axios.post('http://localhost:8000/unUpvoteQuestion', {uid: user._id, qid: question._id}, {headers: {'Content-Type': 'application/json'}});
        }
        else{
            if(question.downVotes.includes(user._id)){
                await axios.post('http://localhost:8000/unDownvoteQuestion', {uid: user._id, qid: question._id}, {headers: {'Content-Type': 'application/json'}});
            }
            await axios.post('http://localhost:8000/upvoteQuestion', {uid: user._id, qid: question._id}, {headers: {'Content-Type': 'application/json'}});
        }
        let res = await axios.get('http://localhost:8000/getAllUsers');
        updateUsers(res.data);
        res = await axios.get('http://localhost:8000/getAllQuestions');
        updateQuestions(res.data);
        changePage(<AnswerPage question = {findQuestion(question._id)} changePage = {changePage}/>);
        console.log(users);
    }
}

let downvoteQuestion = async function(question){
    if(user && user.reputation >= 50){
        if(question.downVotes.includes(user._id)){
            await axios.post('http://localhost:8000/unDownvoteQuestion', {uid: user._id, qid: question._id}, {headers: {'Content-Type': 'application/json'}});
        }
        else{
            if(question.upVotes.includes(user._id)){
                await axios.post('http://localhost:8000/unUpvoteQuestion', {uid: user._id, qid: question._id}, {headers: {'Content-Type': 'application/json'}});
            }
            await axios.post('http://localhost:8000/downvoteQuestion', {uid: user._id, qid: question._id}, {headers: {'Content-Type': 'application/json'}});
        }
        let res = await axios.get('http://localhost:8000/getAllUsers');
        updateUsers(res.data);
        res = await axios.get('http://localhost:8000/getAllQuestions');
        updateQuestions(res.data);
        changePage(<AnswerPage question = {findQuestion(question._id)} changePage = {changePage}/>);
    }
}

let upvoteAnswer = async function(answer){
    if(user && user.reputation >= 50){
        if(answer.upVotes.includes(user._id)){
            await axios.post('http://localhost:8000/unUpvoteAnswer', {uid: user._id, aid: answer._id}, {headers: {'Content-Type': 'application/json'}});
        }
        else{
            if(answer.downVotes.includes(user._id)){
                await axios.post('http://localhost:8000/unDownvoteAnswer', {uid: user._id, aid: answer._id}, {headers: {'Content-Type': 'application/json'}});
            }
            await axios.post('http://localhost:8000/upvoteAnswer', {uid: user._id, aid: answer._id}, {headers: {'Content-Type': 'application/json'}});
        }
        let res = await axios.get('http://localhost:8000/getAllUsers');
        updateUsers(res.data);
        res = await axios.get('http://localhost:8000/getAllAnswers');
        updateAnswers(res.data);
        changePage(<AnswerPage question = {findQuestion(question._id)} changePage = {changePage}/>);
        console.log(users);
    }
}

let downvoteAnswer = async function(answer){
    if(user && user.reputation >= 50){
        if(answer.downVotes.includes(user._id)){
            await axios.post('http://localhost:8000/unDownvoteAnswer', {uid: user._id, aid: answer._id}, {headers: {'Content-Type': 'application/json'}});
        }
        else{
            if(answer.upVotes.includes(user._id)){
                await axios.post('http://localhost:8000/unUpvoteAnswer', {uid: user._id, aid: answer._id}, {headers: {'Content-Type': 'application/json'}});
            }
            await axios.post('http://localhost:8000/downvoteAnswer', {uid: user._id, aid: answer._id}, {headers: {'Content-Type': 'application/json'}});
        }
        let res = await axios.get('http://localhost:8000/getAllUsers');
        updateUsers(res.data);
        res = await axios.get('http://localhost:8000/getAllAnswers');
        updateAnswers(res.data);
        changePage(<AnswerPage question = {findQuestion(question._id)} changePage = {changePage}/>);
    }
}

let upvoteComment = async function(comment){
    if(user){
        console.log("upvoteComment");
        if(comment.upVotes.includes(user._id)){
            await axios.post('http://localhost:8000/unUpvoteComment', {uid: user._id, cid: comment._id}, {headers: {'Content-Type': 'application/json'}});
        }
        else{
            await axios.post('http://localhost:8000/upvoteComment', {uid: user._id, cid: comment._id}, {headers: {'Content-Type': 'application/json'}});
        }
        let res = await axios.get('http://localhost:8000/getAllUsers');
        updateUsers(res.data);
        res = await axios.get('http://localhost:8000/getAllComments');
        updateComments(res.data);
        changePage(<AnswerPage question = {findQuestion(question._id)} changePage = {changePage}/>);
    }
}

let commentQuestion = async function(event, thing, cError, commentValue){
    console.log("commentQuestion");
    if(event.keyCode === 13 && checkComment(cError, commentValue)){
        let newComment = {text: commentValue, postBy: user._id}
        await axios.post('http://localhost:8000/commentQuestion', {qid: thing._id, comment: newComment}, {headers: {'Content-Type': 'application/json'}});
        let res = await axios.get('http://localhost:8000/getAllQuestions');
        updateQuestions(res.data);
        res = await axios.get('http://localhost:8000/getAllComments');
        updateComments(res.data);
        changePage(<AnswerPage question = {findQuestion(question._id)} changePage = {changePage}/>);
        
    }

}
let commentAnswer = async function(event, thing, cError, commentValue){
    if(event.keyCode === 13 && checkComment(cError, commentValue)){
        let newComment = {text: commentValue, postBy: user._id}
        await axios.post('http://localhost:8000/commentAnswer', {aid: thing._id, comment: newComment}, {headers: {'Content-Type': 'application/json'}});
        let res = await axios.get('http://localhost:8000/getAllAnswers');
        updateAnswers(res.data);
        res = await axios.get('http://localhost:8000/getAllComments');
        updateComments(res.data);
        changePage(<AnswerPage question = {findQuestion(question._id)} changePage = {changePage}/>);
    }
}

let checkComment = function(cError, commentValue){
    if(user.reputation < 50){
        cError.innerHTML = "Your reputation isn't high enough to comment."
        cError.display = "block";
        return false;
    }
    console.log(commentValue)
    if(commentValue.length > 140){
        cError.innerHTML = "Comment cannot be more than 140 characters"
        cError.display = "block";
        return false;
    }
    return true;
}

let getAnswer = function(aid){
    for(let answer of answers){
      if(answer._id === aid){
        return answer;
      }
    }
    return null;
}

let findQuestion = function(questionId){
    return questions.filter(question => question._id === questionId)[0];
  }

let findComment = function(commentId){
    return comments.filter(comment => comment._id === commentId)[0];
}

