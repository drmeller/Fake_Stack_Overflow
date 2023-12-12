import {questions, tags, tagQuestionNumber} from './global.js';
import QuestionPage from './questionPage';
import QuestionForm from './questionForm';



var changePage; 
export default function TagPage(props){
    changePage = props.changePage;
    let tagList = tags;
    if(props.user){
        tagList = userTags(props.user);
    }
    return(
        <div id = "tagPage" className = "page">
            <div id = "tagPageTop">
                <h3 id = "numTags">{tagList.length+" Tags"}</h3>
                <h3 id = "allTags" >All Tags</h3>
                <button id = "askQuestion3" className = "blueButton" onClick = {() => props.changePage(<QuestionForm changePage = {props.changePage}/>)}>Ask Question</button>
            </div>
            <div id = "tagArea">
                {tagGroups(tagList).map((tagGroup, index) => <TagRow tagGroup = {tagGroup} key = {index}/>)}
            </div>
        </div>
    )
}

let tagGroups = function(tagList){
    let result = [];
    for(let i = 0; i < tagList.length; i+=3){
        result.push(tagList.slice(i,i+3));
    }
    return result;
}

function TagRow(props){
    return(
        <div className = "tagRow">
            {props.tagGroup.map((tag,index) => <TagLinkBox tag = {tag} key = {index}/>)}
        </div>
    )
}

function TagLinkBox(props){
    let numQuestions = "1 question";
    if(tagQuestionNumber(props.tag.tid) !== 1){
        numQuestions = tagQuestionNumber(props.tag._id)+" questions";
    }
    return(
        <div className = "tagLinkBox">
            <p className = "tagLink" onClick = {() => searchTag(props.tag)}>{props.tag.name}</p>
            <p className = "tagQuestions">{numQuestions}</p>
        </div>
    )
}

let searchTag = function(tag){
    let questionList = [];
    for(let question of questions){
      if(question.tags.includes(tag._id)){
        questionList.push(question);
      }
    }
    changePage(<QuestionPage title = {"Tag: "+tag.name} questionList = {questionList} mode = {1} changePage = {changePage}/>,1)
  }

  let userTags = function(user){
    return tags.filter(tag => tag.creator === user._id)
  }