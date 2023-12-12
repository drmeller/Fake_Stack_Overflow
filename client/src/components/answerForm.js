import {updateQuestions, updateAnswers, isEmpty, invalidLink, user} from './global.js';
import AnswerPage from './answerPage.js';
import axios from 'axios';

var changePage;
export default function AnswerForm(props){
    changePage = props.changePage;
    return(
        <div id = "answerForm" className = "page">
            <h3>Answer Text*</h3>
            <textarea className = "aInput" id = "aInput" style = {{height: "100px"}}></textarea>
            <p className = "aError" id = "aError">Field cannot be empty.</p>
            <div style = {{height: "20px"}}></div>
            <button className = "blueButton" id = "postAnswer" onClick = {() => {postAnswer(props.question)}}>Post Answer</button>
            <p style = {{color: "red"}}>*includes mandatory fields</p>
        </div>
    )
}

let postAnswer = async function(question){
    let errors = false;
    let textField =  document.getElementById("aInput");
    //check for errors
    textField.style.display = "none";

    if(isEmpty(textField.value)){
        textField.style.display = "block";
        document.getElementById("aError").innerHTML = "Field cannot be empty."
        errors = true;
    }

    if(invalidLink(textField.value)){
        textField.style.display = "block";
        document.getElementById("aError").innerHTML = "Links must begin with \"https://\" or \"http://\"";
        errors = true;
    }

    //add answer
    if(!errors){
        let newAnswer = {
            text: textField.value.replace(/\n/g, "<br>"),
            postBy: user._id,
        }
        let res = await axios.post('http://localhost:8000/addAnswer', newAnswer, {headers: {'Content-Type': 'application/json'}});
        let ansId = res.data;
        let Ids = {qid: question._id, aid: ansId};
        res = await axios.get('http://localhost:8000/getAllAnswers');
        updateAnswers(res.data);
        res = await axios.post('http://localhost:8000/addAnsId', Ids, {headers: {'Content-Type': 'application/json'}});
        let newQuestion = res.data.newQuestion;
        res = await axios.get('http://localhost:8000/getAllQuestions'); 
        updateQuestions(res.data);
        changePage(<AnswerPage question = {newQuestion} changePage = {changePage}/>)
    }
}
