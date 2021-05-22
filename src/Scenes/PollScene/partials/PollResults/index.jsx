import firebase from "firebase";
import React, { useCallback, useEffect, useState } from "react";
import roomImg from "../../../../Assets/Images/room.png";
import userImg from "../../../../Assets/Images/user.png";
import styles from "../../index.module.scss";
import { useParams } from "react-router";
import axios from "axios";
import { useHistory } from "react-router";

function PollResults({ setIsInvalidRoom }) {
  const [pollData, setPollData] = useState({});
  const [selectedPoll, setSelectedPoll] = useState("");
  const { pollId } = useParams();

  function setHasVoted(pollValue) {
    const currentUserId = window.localStorage.getItem("loggedId");
    const userRef = firebase.database().ref(pollId).child(currentUserId);
    userRef.update({
      voted: !selectedPoll.length,
      voteValue: pollValue === selectedPoll ? "" : pollValue,
    });
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

  useEffect(() => {
    fetchCurrentPollData();
  }, [fetchCurrentPollData]);

  if (!pollData) {
    setIsInvalidRoom();
    return null;
  }

  return (
    <div className={styles.resultsWrapper}>
      <div className={styles.cardHeader}>
        <div className={styles.pollName}>
          <img src={roomImg} alt="RoomName" className={styles.roomImg} />
          {pollData.roomName}
        </div>
        <div className={styles.logged}>
          <img src={userImg} alt="User" className={styles.userImg} />
          {window.localStorage.getItem("loggedUser") || "User"}
        </div>
      </div>
      <div className={`${styles.seriesWrapper}`}>
        {pollData.series &&
          pollData.series.length &&
          pollData.series.map((entry, key) => {
            return (
              <div
                key={key}
                className={`${styles.entryCard} ${
                  selectedPoll === entry.entryValue ? styles.selectedPoll : ""
                }`}
                onClick={() => {
                  setSelectedPoll(
                    entry.entryValue === selectedPoll ? "" : entry.entryValue
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
  );
}

export default PollResults;
