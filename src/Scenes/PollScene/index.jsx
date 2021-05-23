import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import NameInput from "./partials/NameInput";
import firebase from "firebase";
import styles from "./index.module.scss";
import PollResults from "./partials/PollResults";
import UsersList from "./partials/UsersList";
import Button from "@material-ui/core/Button";
import { restartPoll, setPollStatus } from "./firebaseCalls.utils";
import "reactjs-popup/dist/index.css";

function PollScene() {
  let { pollId } = useParams();
  const [loggedUsers, setLoggedUsers] = useState([]);
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allowShow, setAllowShow] = useState(false);

  let history = useHistory();

  const getLoggedUsers = useCallback(() => {
    const userRef = firebase.database().ref(pollId + "/users");
    userRef.on("value", (snapshot) => {
      const users = snapshot.val();
      const tempUsers = [];
      for (let id in users) {
        if (users[id].name === window.localStorage.getItem("loggedUser")) {
          window.localStorage.setItem("loggedId", id);
        }
        tempUsers.push({ id, ...users[id] });
      }
      setLoggedUsers(tempUsers);
      const loggedId = window.localStorage.getItem("loggedId");
      if (loggedId) {
        const currentRef = firebase
          .database()
          .ref(pollId + "/users")
          .child(loggedId);
        currentRef
          .onDisconnect()
          .remove(window.localStorage.removeItem("loggedUser"))
          .then(() => {
            setPollStatus(pollId);
          });
      }
    });
  }, [pollId]);

  const getPollingStaus = useCallback(() => {
    const pollRef = firebase.database().ref(pollId + "/pollstatus");
    pollRef.on("value", (snapshot) => {
      const polldata = snapshot.val();
      if (polldata) {
        setAllowShow(polldata.pollStatus || false);
      }
    });
  }, [pollId]);

  const checkResultsStatus = useCallback(() => {
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.on("value", (snapshot) => {
      const resultStatus = snapshot.val();
      console.log("resultStatus", resultStatus);
      if (resultStatus) {
        setShowResults(resultStatus.resultsShown || false);
      }
    });
  }, [pollId]);

  useEffect(() => {
    getLoggedUsers();
    getPollingStaus();
    checkResultsStatus();
  }, [checkResultsStatus, getLoggedUsers, getPollingStaus]);

  const onShowResults = () => {
    alert(allowShow);
    setShowResults(true);
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.set({ resultsShown: true });
  };

  const onPollRestart = () => {
    alert(allowShow + "rs");
    setShowResults(false);
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.set({ resultsShown: false });
    const resetRef = firebase.database().ref(pollId + "/resetPolls");
    resetRef.set({ reset: true });
    restartPoll(pollId);
  };

  return (
    <div className={styles.pollScene}>
      <div className={styles.headerRow}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (window.confirm("Start new game?")) {
              history.replace("/");
              const loggedId = window.localStorage.getItem("loggedId");
              if (loggedId) {
                const currentRef = firebase
                  .database()
                  .ref(pollId + "/users")
                  .child(loggedId);
                currentRef.remove(window.localStorage.removeItem("loggedUser"));
              }
            }
          }}
        >
          New Game
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={() => {
            window.opener = null;
            window.open("about:blank", "_self");
            setTimeout(() => {
              window.close();
            }, 1000);
          }}
        >
          Leave
        </Button>
      </div>
      <Popup
        modals
        defaultOpen={!window.localStorage.getItem("loggedUser")}
        closeOnDocumentClick={false}
        className="my-popup-content"
        contentStyle={{
          width: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {(close) => <NameInput close={close} isInvalidRoom={isInvalidRoom} />}
      </Popup>
      <div className={styles.pollResults}>
        <div className={styles.brandName}>SprintPlan</div>
        <PollResults
          setIsInvalidRoom={() => setIsInvalidRoom(true)}
          showResults={showResults}
        />
      </div>
      <div className={styles.usersWrapper}>
        {loggedUsers && loggedUsers.length ? (
          <UsersList users={loggedUsers} />
        ) : null}
      </div>
      {allowShow ? (
        <div
          className={`${
            showResults ? styles.showResultsBtn : styles.showRestartBtn
          } ${styles.footerBtns}`}
          onClick={() => (!showResults ? onShowResults() : onPollRestart())}
        >
          {showResults ? "Restart Poll" : "Show Results"}
        </div>
      ) : null}
    </div>
  );
}

export default PollScene;
