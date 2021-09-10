import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import NameInput from "./partials/NameInput";
import firebase from "firebase";
import styles from "./index.module.scss";
import PollResults from "./partials/PollResults";
import UsersList from "./partials/UsersList";
import { restartPoll, setPollStatus } from "./firebaseCalls.utils";
import "reactjs-popup/dist/index.css";

function PollScene() {
  let { pollId } = useParams();
  const [loggedUsers, setLoggedUsers] = useState([]);
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allowShow, setAllowShow] = useState(false);
  const [resultsData, setResultsData] = useState({});

  const getLoggedUsers = useCallback(() => {
    const userRef = firebase.database().ref(pollId + "/users");
    userRef.on("value", (snapshot) => {
      const users = snapshot.val();
      const tempUsers = [];
      for (let id in users) {
        if (users[id].name === window.localStorage.getItem("loggedUserName")) {
          window.localStorage.setItem("loggedId", id);
          if (users[id].isSpectator) {
            window.localStorage.setItem("isSpectator", true);
          }
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
          .remove(() => {
            window.localStorage.removeItem("loggedUser");
            window.localStorage.removeItem("isSpectator");
          })
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

  const getResults = () => {
    const userRef = firebase.database().ref(pollId + "/users");
    userRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const data = {};
          for (let id in users) {
            const voteValue = users[id].voteValue;
            //count votes
            if (data[voteValue]) {
              data[voteValue].push(users[id].name);
            } else {
              data[voteValue] = [users[id].name];
            }
            setResultsData(data);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onShowResults = () => {
    setShowResults(true);
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.set({ resultsShown: true }).then(() => {
      getResults();
    });
  };

  const onPollRestart = () => {
    setShowResults(false);
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.set({ resultsShown: false });
    const resetRef = firebase.database().ref(pollId + "/resetPolls");
    resetRef.set({ reset: true });
    restartPoll(pollId);
  };

  return (
    <div className={styles.pollScene}>
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
          resultsData={resultsData}
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
