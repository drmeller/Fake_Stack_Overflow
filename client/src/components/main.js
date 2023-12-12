import React from 'react';
import axios from 'axios';
import {questions, updateQuestions, updateAnswers, updateTags, updateComments, getTagId, user, changeUser} from './global.js'
import QuestionPage from './questionPage.js';
import TagPage from './tagPage.js';
import UserProfile from './userProfile.js'

let backFunction;
let changePage;
export default class Main extends React.Component {
  constructor(){
    super();
    this.state = {
      menu: 1, 
      page: "Server not connected",
    }
  }
  changePage = (newPage, menuOption) => {
    this.setState({
      menu: menuOption,
      page: newPage, 
    });
  };
  searchQuestions = event => {
    if(event.keyCode === 13){
      let questionList = [];
      let searchList = document.getElementById("search").value.split(" ");
      for(let question of questions){
        for(let word of searchList){
          if(word[0] === '[' && word[word.length-1] === ']'){
            for(let tagName of word.slice(1,-1).split("][")){
              if(question.tags.includes(getTagId(tagName))){
                questionList.push(question);
              }
            }
          }
          else{
            if((" "+question.title+" ").toLowerCase().includes((" "+word+" ").toLowerCase()) || (" "+question.text+" ").toLowerCase().includes((" "+word+" ").toLowerCase())){
              questionList.push(question);
            }
          }
        }
      }
      questionList = Array.from(new Set(questionList));
      this.changePage(<QuestionPage title = "Search Results" questionList = {questionList} mode = {1} changePage = {this.changePage}/>,1)
    }
  }

  async componentDidMount(){
    backFunction = this.props.backFunction;
    changePage = this.changePage;
    let res = await axios.get('http://localhost:8000/getAllQuestions');
    updateQuestions(res.data);
    res = await axios.get('http://localhost:8000/getAllAnswers');
    updateAnswers(res.data);
    res = await axios.get('http://localhost:8000/getAllTags');
    updateTags(res.data);
    res = await axios.get('http://localhost:8000/getAllComments');
    updateComments(res.data);
    this.changePage(<QuestionPage title = "All Questions" questionList = {questions} mode = {1} changePage = {this.changePage}/>,1)
  }
  render() {
    return (
      <div>
        <div id = "header" className = "header">
          <input id = "search" type = "text" placeholder = "Search..."  onKeyUp = {(event) => this.searchQuestions(event)}></input>
          <h1 id = "fsoTitle" >Fake Stack Overflow</h1>
          <div style = {{marginTop: "10px", marginLeft: "20%"}}>
            <UserDisplay/>
            <SignButton/>
          </div>
        </div>
        <div id="main" className="main">
          <div id = "menu">
            <div
            id = "questionsOption" 
            className = {this.state.menu === 1?"menuSelected":"menuOption"}
            onClick = {() => this.changePage(<QuestionPage title = "All Questions" questionList = {questions} mode = {1} changePage = {this.changePage}/>,1)}
            >Questions</div>
            <div
             id = "tagsOption" 
             className = {this.state.menu === 2?"menuSelected":"menuOption"}
             onClick = {() => this.changePage(<TagPage changePage = {this.changePage}/>,2)}
             >Tags</div>
          </div>
          {this.state.page}
        </div>
      </div>
    );
  }
}

function UserDisplay(){
  return(
    <div>
      {!user && <div>Guest</div>}
      {user && <button onClick = {() => changePage(<UserProfile user = {user} changePage = {changePage}/>)}style = {{backgroundColor: 'lightblue', marginTop: '5px'}}>{user.username+" profile"}</button>}
    </div>
  )
}

function SignButton(){
  return(
    <div>
      {!user && <button style = {{backgroundColor: 'green', marginTop: '5px'}} onClick = {() => backFunction()}>Sign in</button>}
      {user && <button style = {{backgroundColor: 'lightblue', marginTop: '5px', marginLeft: '17px'}} onClick = {() => logout()}>Log out</button>}
    </div>
  )
}

function logout(){
  axios.post('http://localhost:8000/logout').then(() => {
    changeUser(null);
    backFunction()
  });
}




