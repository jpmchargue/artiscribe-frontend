import React from 'react';
//import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <div class="header">
          <p> Artiscribe </p>
        </div>

      </div>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/">
          <Discover />
        </Route>
      </Switch>
    </Router>
  );
}

function Discover() {
  return <h1>Welcome to the discover page.</h1>
}

function Login() {
  return <h1>Log in</h1>
}

function Signup() {
  return <h1>Sign up</h1>
}

export default App;
