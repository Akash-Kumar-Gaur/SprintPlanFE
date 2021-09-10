import React, { useState, useEffect, useCallback } from "react";
import styles from "../../index.module.scss";
import votedImg from "../../../../Assets/Images/voted.png";
import firebase from "firebase";
import { useParams } from "react-router";

function UsersList({ users }) {
  const filterUsers = users;
  const [showRes, setShowRes] = useState(false);

  const { pollId } = useParams();

  const getResStatus = useCallback(() => {
    const pollRef = firebase.database().ref(pollId + "/resultsShown");
    pollRef.on(
      "value",
      (snapshot) => {
        const resultStatus = snapshot.val();
        if (resultStatus) {
          setShowRes(resultStatus.resultsShown || false);
        }
      },
      () => {
        const pollRef = firebase.database().ref(pollId + "/resultsShown");
        pollRef.off();
      }
    );
  }, [pollId]);

  useEffect(() => {
    getResStatus();
  }, [getResStatus]);

  const joinedUsers = filterUsers.filter((user) => user.isSpectator === false);
  const spectators = filterUsers.filter((user) => user.isSpectator === true);

  return (
    <>
      {joinedUsers.length ? (
        <div className={styles.usersDiv}>
          <div className={styles.joined}>Joined Users:</div>
          <div className={styles.wrapperBox}>
            {joinedUsers.map((user, key) => {
              const userName =
                user.name || window.localStorage.getItem("loggedUserName");
              return user.name ? (
                <div className={styles.cardWrapper} key={key}>
                  <div className={styles.userCard}>
                    {user.voted ? (
                      !showRes ? (
                        <img
                          src={votedImg}
                          alt="voted"
                          className={styles.votedImg}
                        />
                      ) : (
                        user.voteValue
                      )
                    ) : null}
                  </div>
                  <div className={styles.userName}>
                    {user.name === window.localStorage.getItem("loggedUserName")
                      ? `${userName}(Me)`
                      : userName}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      ) : null}
      {spectators.length ? (
        <div
          className={styles.usersDiv}
          style={{
            marginTop: 30,
          }}
        >
          <div
            className={styles.joined}
            style={{
              fontSize: 20,
            }}
          >
            Spectators:
          </div>
          <div className={styles.wrapperBox}>
            {spectators.map((user, key) => {
              const userName =
                user.name || window.localStorage.getItem("loggedUserName");
              return user.name ? (
                <div className={styles.cardWrapper} key={key}>
                  <div
                    className={styles.userCard}
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    {user.voted ? (
                      !showRes ? (
                        <img
                          src={votedImg}
                          alt="voted"
                          className={styles.votedImg}
                        />
                      ) : (
                        user.voteValue
                      )
                    ) : null}
                  </div>
                  <div
                    className={styles.userName}
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    {user.name === window.localStorage.getItem("loggedUserName")
                      ? `${userName}(Me)`
                      : userName}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default UsersList;
