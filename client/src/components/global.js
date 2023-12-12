export let questions = [];
export let answers = [];
export let tags = [];
export let comments = [];
export let users = [];
export let user = null;

export let updateQuestions = function(newQuestions){
    questions = newQuestions;
}

export let updateAnswers = function(newAnswers){
    answers = newAnswers;
}

export let updateTags = function(newTags){
    tags = newTags;
}

export let updateComments = function(newComments){
  comments = newComments;
}

export let updateUsers = function(newUsers){
  users = newUsers;
}

export let changeUser = function(newUser){
  user = newUser;
}

//Helper functions

export function TagBoxes(props){
    return(
        <div style = {{display: "flex"}}>{props.tags.map((tag, index)=><TagBox key = {index} tag = {tag}/>)}</div>
    )
}

function TagBox(props){
    return (
        <div className = "tagBox"> {getTagName(props.tag)}</div>
    )
}
export let findUser = function(userId){
  return users.filter(user => user._id === userId)[0];
}
export let showDate = function (date) {
    var monthNames = {0: "Jan",1: "Feb",2: "Mar",3: "Apr",4: "May",5: "Jun",6: "Jul",7: "Aug",8: "Sep",9: "Oct",10: "Nov",11: "Dec",};
    var z = function (num) {
      if (num < 10) return "0" + num;
      else return num;
    };
    var today = new Date();
    if (today.getDate() === date.getDate()) {
      if (date.getMinutes() === today.getMinutes()) return today.getSeconds() - date.getSeconds() + " seconds ago";
      else if (today.getHours() === date.getHours()) return today.getMinutes() - date.getMinutes() + " minutes ago";
      else return today.getHours() - date.getHours() + " hours ago";
    } 
    else if (today.getFullYear() === date.getFullYear()) {
      return (monthNames[date.getMonth()] +" " +date.getDate() +" at " +date.getHours() +":" +z(date.getMinutes()));
    } 
    else {
      return (monthNames[date.getMonth()] +" " +date.getDate() +", " +date.getFullYear() +" at " +date.getHours() +":" +z(date.getMinutes()));
    }
    };
  
  export let getTagName = function(tid){
    for(let tag of tags){
      if(tag._id === tid){
        return tag.name;
      }
    }
    return "N/A";
  }
  
  export let getTagId = function(name){
    for(let tag of tags){ 
      if(tag.name.toLowerCase() === name.toLowerCase()){
        return tag._id;
      }
    }
    return "N/A";
  }
  
  export let tagQuestionNumber = function(tagId){
    let result = 0;
    for(let question of questions){
      if(question.tags.includes(tagId)) result++;
    }
    return result;
  }
  
  export let getAnswer = function(aid){
    for(let answer of answers){
      if(answer._id === aid){
        return answer;
      }
    }
    return null;
  }
  
  export let isEmpty = function (str) {
    return str.length === 0;
  };

  export let wordCount = function (str) {
    return str.split(" ").length;
  };

  export let longWords = function (str) {
    let array = str.split(" ");
    if (array.length > 5) {
      return true;
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i].length > 10) {
        return true;
      }
    }
    return false;
  };
  
  export let lastAnswered = function(question){
    let result = new Date(0);
    for (let ans of question.answers){
      if(new Date(getAnswer(ans).ans_date_time)>result){
        result = new Date(getAnswer(ans).ans_date_time);
      }
    }
    return result;
  }

  export let invalidLink = function (str) {
    let array = str.split(/\[(.*?)\]\((.*?)\)/g);
    for (let i = 2; i < array.length; i += 3) {
      if (array[i].indexOf("https://") !== 0 && array[i].indexOf("http://") !== 0) {
        return true;
      }
    }
    return false;
  };

  export let makeLinks = function(text) {
    let array = text.split(/\[(.*?)\]\((.*?)\)/g);
    return array.map((part, index) => {
      if (index % 3 === 1) {
        return (
          <a style={{ fontSize: "1em" }} key={index} target="_blank" rel="noreferrer" href={array[index + 1]}>{part}</a>
        );
      }
      if (index % 3 === 0) {
        return part;
      }
      else{
        return "";
      }
    });
  }
