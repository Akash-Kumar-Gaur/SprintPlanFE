import "./App.css";
import firebase from "firebase";
import HomeScene from "./Scenes/HomeScene";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PollScene from "./Scenes/PollScene";

function App() {
  var firebaseConfig = {
    apiKey: "AIzaSyBS1I98jAMMABrxEIiDnTZahVdoGNlSDjY",
    authDomain: "sprintplan-66723.firebaseapp.com",
    databaseURL: "https://sprintplan-66723-default-rtdb.firebaseio.com",
    projectId: "sprintplan-66723",
    storageBucket: "sprintplan-66723.appspot.com",
    messagingSenderId: "769079674943",
    appId: "1:769079674943:web:3210f552edde59a11ed08a",
    measurementId: "G-WK9Z6DC62B",
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  firebase.analytics();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path={`/pollRoom/:pollId`}>
            <PollScene />
          </Route>
          <Route path="/">
            <HomeScene />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
