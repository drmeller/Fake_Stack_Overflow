import {questions, updateQuestions, tags, updateTags, isEmpty, wordCount, longWords, invalidLink, user} from './global.js';
import QuestionPage from './questionPage.js';
import axios from 'axios';

var changePage;

export default function QuestionForm(props){
    changePage = props.changePage;
    return(
        <div id = "questionForm" className = "scrollPage">
              <h3>Question Title*</h3>
              <p>Limit the title to 50 characters or less</p>
              <input className = "qInput"></input>
              <p id = "qError0" className = "qError">Error</p>
              <h3>Summary</h3>
              <p>Limit the summary to 140 characters or less</p>
              <textarea className = "qInput" style = {{height: "50px"}}></textarea>
              <p id = "qError1" className = "qError">Error</p>
              <h3>Question Text*</h3>
              <p>Add details</p>
              <textarea className = "qInput" style = {{height: "100px"}}></textarea>
              <p id = "qError2" className = "qError">Error</p>
              <h3>Tags*</h3>
              <p>Add keywords seperated by white spaces</p>
              <input className = "qInput"></input>
              <p id = "qError3" className = "qError">Error</p>
              <button id = "submitQform" className = "blueButton" style = {{display: "block", margin: "10px"}} onClick = {() => submitQform()}>Submit</button>
              <p style = {{color: "red"}}>*Includes mandatory fields</p>
        </div>
    )
}

let submitQform = async function(){
    let elements = document.getElementsByClassName("qInput");
    let errors = false;
    //check for errors
    for(let error of document.getElementsByClassName("qError")){
        error.style.display = "none";
    }
    for(let i = 0; i < elements.length; i++){
        if(i !== 1 && isEmpty(elements[i].value)){
        document.getElementById("qError"+i).style.display = "block";
        document.getElementById("qError"+i).innerHTML = "Field cannot be empty."
        errors = true;
        }
    }
    if(elements[0].value.length > 50){
        document.getElementById("qError0").style.display = "block";
        document.getElementById("qError0").innerHTML = "Title is too long."
        errors = true;
    }
    if(elements[1].value.length > 140){
      document.getElementById("qError1").style.display = "block";
      document.getElementById("qError1").innerHTML = "Title is too long."
      errors = true;
  }
    if(longWords(elements[3].value)){
        document.getElementById("qError3").style.display = "block";
        document.getElementById("qError3").innerHTML = "Tag cannot be more than 10 characters."
        errors = true;
    }
    if(wordCount(elements[3].value) > 5){
        document.getElementById("qError3").style.display = "block";
        document.getElementById("qError3").innerHTML = "Maximum of five tags allowed."
        errors = true;
    }
    if(invalidLink(elements[2].value)){
      document.getElementById("qError2").style.display = "block";
      document.getElementById("qError2").innerHTML = "Links must begin with \"https://\" or \"http://\""
      errors = true;
    }
  //Add new question if no errors
  let newQuestion = {
    title: elements[0].value,
    summary: elements[1].value,
    text: elements[2].value.replace(/\n/g, "<br>"),
    tags: [],
    postBy: user._id,
  }
  for(let tagName of elements[3].value.split(" ")){
    let tagExists = false;
    for(let tag of tags){ 
      if(tag.name.toLowerCase() === tagName.toLowerCase()){
        tagExists = true;
      }
    }
    if(!tagExists){
      console.log("reputation: ",user.reputation < 50);
      if(user.reputation < 50){
        document.getElementById("qError3").style.display = "block";
        document.getElementById("qError3").innerHTML = "Your reputation is not high enough to create new tags."
        errors = true;
      }
      else{
        let newTag = {
          name: tagName,
          creator: user._id,
        }
        await axios.post('http://localhost:8000/addTag', newTag, {headers: {'Content-Type': 'application/json'}});
        let res = await axios.get('http://localhost:8000/getAllTags');
        updateTags(res.data);
      }
    }
    for(let tag of tags){
      if(tag.name === tagName){
          newQuestion.tags.push(tag._id);
      }
    }
  }
  if(!errors){
    await axios.post('http://localhost:8000/addQuestion', newQuestion, {headers: {'Content-Type': 'application/json'}});
    let res = await axios.get('http://localhost:8000/getAllQuestions');
    updateQuestions(res.data);
    changePage(<QuestionPage title = "All Questions" questionList = {questions} mode = {1} changePage = {changePage}/>,1);
  }
}
