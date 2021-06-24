import firebase from "firebase";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../../index.module.scss";
import { useParams } from "react-router";
import axios from "axios";
import { useHistory } from "react-router";
import { setPollStatus } from "../../firebaseCalls.utils";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Button from "@material-ui/core/Button";
import HomeImg from "../../../../Assets/Images/home.png";

const setBg = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

function PollResults({ setIsInvalidRoom, resultsData }) {
  const [pollData, setPollData] = useState({});
  const [selectedPoll, setSelectedPoll] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [resData, setResData] = useState(resultsData);
  const [loggedCount, setLoggedCount] = useState(1);
  const { pollId } = useParams();

  function setHasVoted(pollValue) {
    const currentUserId = window.localStorage.getItem("loggedId");
    const userRef = firebase
      .database()
      .ref(pollId + "/users")
      .child(currentUserId);
    userRef.update(
      {
        voted: pollValue === selectedPoll ? false : true,
        voteValue: pollValue === selectedPoll ? "" : pollValue,
      },
      () => {
        setPollStatus(pollId);
      }
    );
  }

  let history = useHistory();

  const fetchCurrentPollData = useCallback(() => {
    axios
      .get(`https://plansprintbe.herokuapp.com/poll/${pollId}`)
      .then((res) => {
        const response = res.data;
        setPollData(response);
      })
      .catch((err) => {
        history.replace("/");
      });
  }, [history, pollId]);

  const getResults = useCallback(() => {
    const userRef = firebase.database().ref(pollId + "/users");
    userRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("yhnb ", snapshot.val());
          const users = snapshot.val();
          const data = {};
          for (let id in users) {
            if (users[id].voted) {
              const voteValue = users[id].voteValue;
              //count votes
              if (data[voteValue]) {
                data[voteValue].push(users[id].name);
              } else {
                data[voteValue] = [users[id].name];
              }
            }
          }
          setResData(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return {};
  }, [pollId]);

  const checkResultsStatus = useCallback(() => {
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.on("value", (snapshot) => {
      const resultStatus = snapshot.val();
      getResults();
      var ref = firebase.database().ref(pollId + "/users");
      ref.once("value").then(function (snapshot) {
        setLoggedCount(snapshot.numChildren());
      });
      if (resultStatus) {
        setShowResults(resultStatus.resultsShown || false);
      }
    });
  }, [getResults, pollId]);

  const checkIfReset = useCallback(() => {
    const pollRef = firebase.database().ref(pollId + "/resetPolls");
    pollRef.on("value", (snapshot) => {
      const resetPolls = snapshot.val();
      if (resetPolls) {
        if (resetPolls.reset) {
          setSelectedPoll("");
          const resetRef = firebase.database().ref(pollId + "/resetPolls");
          resetRef.set({ reset: false });
          const statusRef = firebase.database().ref(pollId + "/pollstatus");
          statusRef.set({ pollStatus: false });
        }
      }
    });
  }, [pollId]);

  useEffect(() => {
    fetchCurrentPollData();
    checkResultsStatus();
    checkIfReset();
    setResData(resultsData);
  }, [
    checkIfReset,
    checkResultsStatus,
    fetchCurrentPollData,
    pollId,
    resultsData,
    setResData,
  ]);

  if (!pollData) {
    setIsInvalidRoom();
    return null;
  }

  return (
    <div className={styles.resultsWrapper}>
      <div className={styles.cardHeader}>
        <div className={styles.pollName}>
          <div>Room Name</div>
          <div>{pollData.roomName}</div>
        </div>
        <div className={styles.pollId}>
          <div>Room ID</div>
          <div className={styles.idStyle}>{pollId}</div>
        </div>
        <div className={styles.navBtns}>
          <img
            src={HomeImg}
            alt="Home"
            onClick={() => {
              if (window.confirm("Go home and end poll?")) {
                history.replace("/");
                const loggedId = window.localStorage.getItem("loggedId");
                if (loggedId) {
                  const currentRef = firebase
                    .database()
                    .ref(pollId + "/users")
                    .child(loggedId);
                  currentRef.remove(
                    window.localStorage.removeItem("loggedUserName")
                  );
                }
              }
            }}
          />
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
      </div>
      {showResults ? (
        <div className={styles.resultsData}>
          {Object.keys(resData).map((key) => {
            return resData[key].length && key.length ? (
              <div
                className={styles.resWrapper}
                style={{
                  width: `${150 + resData[key].length}px`,
                }}
              >
                <CircularProgressbarWithChildren
                  value={(resData[key].length / loggedCount) * 100}
                  // text={`${66}%`}
                  styles={buildStyles({
                    textSize: "16px",
                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 1,
                    // Colors
                    pathColor: setBg(),
                    textColor: setBg(),
                    trailColor: "#d6d6d6",
                    backgroundColor: "#3e98c7",
                    margin: "10px",
                  })}
                >
                  <div>
                    <div className={styles.voteValue}>{key}</div>
                    <div className={styles.voteCount}>
                      {resData[key].length}{" "}
                      {resData[key].length > 1 ? "Votes" : "Vote"}
                    </div>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            ) : null;
          })}
        </div>
      ) : (
        <div className={styles.resultsDiv}>
          Select one card
          <div className={`${styles.seriesWrapper}`}>
            {pollData.series &&
              pollData.series.length &&
              pollData.series.map((entry, key) => {
                return (
                  <div
                    key={key}
                    className={`${styles.entryCard} ${
                      selectedPoll === entry.entryValue
                        ? styles.selectedPoll
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedPoll(
                        entry.entryValue === selectedPoll
                          ? ""
                          : entry.entryValue
                      );
                      setHasVoted(entry.entryValue);
                    }}
                  >
                    {entry.entryValue}
                  </div>
                );
              })}
            {/* <button onClick={() => console.log("pollData", pollData)}>check</button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default PollResults;
