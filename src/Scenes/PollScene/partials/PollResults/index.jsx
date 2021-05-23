import firebase from "firebase";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../../index.module.scss";
import { useParams } from "react-router";
import axios from "axios";
import { useHistory } from "react-router";
import { setPollStatus } from "../../firebaseCalls.utils";
import { Line } from "rc-progress";

const setBg = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

function PollResults({ setIsInvalidRoom }) {
  const [pollData, setPollData] = useState({});
  const [selectedPoll, setSelectedPoll] = useState("");
  const [showResults, setShowResults] = useState(false);
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
      .get(`https://plansprint.herokuapp.com/poll/${pollId}`)
      .then((res) => {
        const response = res.data;
        setPollData(response);
      })
      .catch((err) => {
        history.replace("/");
      });
  }, [history, pollId]);

  const checkResultsStatus = useCallback(() => {
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.on("value", (snapshot) => {
      const resultStatus = snapshot.val();
      if (resultStatus) {
        setShowResults(resultStatus.resultsShown || false);
      }
    });
  }, [pollId]);

  const checkIfReset = useCallback(() => {
    const pollRef = firebase.database().ref(pollId + "/resetPolls");
    pollRef.on("value", (snapshot) => {
      const resetPolls = snapshot.val();
      console.log("resetPolls", resetPolls);
      if (resetPolls) {
        if (resetPolls.reset) {
          setSelectedPoll("");
        }
      }
    });
  }, [pollId]);

  useEffect(() => {
    fetchCurrentPollData();
    checkResultsStatus();
    checkIfReset();
  }, [checkIfReset, checkResultsStatus, fetchCurrentPollData]);

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
      </div>
      {showResults ? (
        <div className={styles.resultsData}>
          <Line percent="70" strokeWidth="2" strokeColor={setBg()} />
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
