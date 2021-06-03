import "./App.css";
import firebase from "firebase";
import HomeScene from "./Scenes/HomeScene";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PollScene from "./Scenes/PollScene";
import { ToastProvider } from "react-toast-notifications";
import { useEffect } from "react";
import axios from "axios";

function App() {
  var firebaseConfig = {
    // removed my config
    // {..your firbase config}
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  firebase.analytics();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://plansprint.herokuapp.com/testBE",
    }).then((res) => {
      console.log(res.data);
    });
  });

  return (
    <div className="App">
      <ToastProvider placement="bottom-right">
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
      </ToastProvider>
    </div>
  );
}

export default App;
