import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Main from './main.js';
import {user, changeUser, users, updateUsers} from './global.js';

axios.defaults.withCredentials = true;

let start, login, signup, beginning;

export default function FakeStackOverflow() {
  let [page, setPage] = useState(<Welcome/>);
  start = () => setPage(<Main backFunction = {beginning}/>);
  login = () => setPage(<Login/>);
  signup = () => setPage(<Signup/>);
  beginning = () => setPage(<Welcome/>);
  useEffect(() =>{
    axios.get('http://localhost:8000/getAllUsers').then(result => {
      updateUsers(result.data);
      axios.get('http://localhost:8000/').then(result => {
        if(result.data.user){
          changeUser(users.filter(theUser => theUser.username === result.data.user)[0]);
          start();
        }
      }
        );
    })
})
  return (
    <div>{page}</div>
  );
}

function Welcome(){
  return(
    <div style = {{marginLeft: '35%', marginTop: '10%'}}>
      <h1>Welcome to Fake Stack Overflow!</h1>
      <div style = {{display: 'flex'}}>
        <button style = {{marginLeft: '40px'}} onClick = {() => signup()}>Sign Up</button>
        <button style = {{marginLeft: '10px'}} onClick = {() => login()}>Login</button>
        <button style = {{marginLeft: '10px'}} onClick = {() => start()}>Continue as Guest</button>
      </div>
    </div>
  )
}

function Login(){
  return(
    <div style = {{marginLeft: '35%', marginTop: '10%'}}>
      <h1>Login</h1>
      <p>Email</p>
      <input id = 'lInput1'></input>
      <p id = "lError1" className = "lError">Error</p>
      <p>Password</p>
      <input type = 'password' id = 'lInput2'></input>
      <p id = "lError2" className = "lError">Error</p>
      <div style = {{height: '10px'}}></div>
      <button onClick = {() => handleLogin()}>Login</button>
      <button style = {{marginLeft: '10px'}} onClick = {() => beginning()}>Back</button>
    </div>
  )
}

function handleLogin(){
  for(let element of document.getElementsByClassName('lError')){
    element.style.display = 'none';
  }
  let theUser = users.filter(user => user.email === document.getElementById("lInput1").value);

  if (!theUser.length){
    document.getElementById("lError1").innerHTML = "Email was not found";
    document.getElementById("lError1").style.display = "block";
    return;
  }
  let attempt = {
    email: document.getElementById("lInput1").value,
    password: document.getElementById("lInput2").value,
  }
  axios.post('http://localhost:8000/login', attempt)
    .then(() => start())
    .catch(() => {
      document.getElementById("lError2").innerHTML = "Incorrect password";
      document.getElementById("lError2").style.display = "block";
    })
}

function Signup(){
  return(
    <div style = {{marginLeft: '35%', marginTop: '5%'}}>
      <h1>Register</h1>
      <p>Username</p>
      <input id = 'sInput1'></input>
      <p id = 'sError1' className = 'sError'>Error</p>
      <p>Email</p>
      <input id = 'sInput2'></input>
      <p id = 'sError2' className = 'sError'>Error</p>
      <p>Password</p>
      <input type = 'password' id = 'sInput3'></input>
      <p id = 'sError3' className = 'sError'>Error</p>
      <p>Verify Password</p>
      <input type = 'password' id = 'sInput4'></input>
      <p id = 'sError4' className = 'sError'>Error</p>
      <div style = {{height: '10px'}}></div>
      <button onClick = {() => handleSignup()}>Sign Up</button>
      <button style = {{marginLeft: '10px'}} onClick = {() => beginning()}>Back</button>
    </div>
  )
}

async function handleSignup(){
  for(let element of document.getElementsByClassName('sError')){
    element.style.display = 'none';
  }
  for(let user in users){
    if(user.username === document.getElementById('sInput1').value){
      document.getElementById('qError1').innerHTML = "Username already exists";
      document.getElementById('qError1').style.display = 'block';
      return;
    }
    if(user.email === document.getElementById('sInput2').value){
      document.getElementById('qError2').innerHTML = "This email is already registered";
      document.getElementById('qError2').style.display = 'block';
      return;
    }
  }
  if(document.getElementById('sInput1').value === ''){
    document.getElementById('sError1').innerHTML = "Username is required";
    document.getElementById('sError1').style.display = 'block';
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('sInput2').value)){
    document.getElementById('sError2').innerHTML = "Email is invalid";
    document.getElementById('sError2').style.display = 'block';
    return;
  }
  if(document.getElementById('sInput3').value.indexOf(document.getElementById('sInput1').value) !== -1){
    document.getElementById('sError3').innerHTML = "Password cannot contain username";
    document.getElementById('sError3').style.display = 'block';
    return;
  }
  if(document.getElementById('sInput3').value.indexOf(document.getElementById('sInput1').value) !== -1){
    document.getElementById('sError3').innerHTML = "Password cannot contain email";
    document.getElementById('sError3').style.display = 'block';
    return;
  }
  if(document.getElementById('sInput3').value.length < 6){
    document.getElementById('sError3').innerHTML = "Password must have at least 6 characters";
    document.getElementById('sError3').style.display = 'block';
    return;
  }
  if(document.getElementById('sInput4').value !== document.getElementById('sInput3').value){
    document.getElementById('sError4').innerHTML = "Passwords do not match";
    document.getElementById('sError4').style.display = 'block';
    return;
  }
  let newUser = {
    username: document.getElementById('sInput1').value,
    email: document.getElementById('sInput2').value,
    password: document.getElementById('sInput3').value,
  }
  await axios.post('http://localhost:8000/addUser', newUser, {headers: {'Content-Type': 'application/json'}})
  let res = await axios.get('http://localhost:8000/getAllUsers')
  updateUsers(res.data);
  login();
}