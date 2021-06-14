import React, { useState, useEffect, useCallback } from "react";
import styles from "../../index.module.scss";
import votedImg from "../../../../Assets/Images/voted.png";
import firebase from "firebase";
import { useParams } from "react-router";
import maleImg from "../../../../Assets/Images/male.png";
import femaleImg from "../../../../Assets/Images/female.png";

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

  return (
    <div className={styles.usersDiv}>
      <div className={styles.joined}>Joined Users:</div>
      <div className={styles.wrapperBox}>
        {filterUsers.map((user, key) => {
          return user.name ? (
            <div className={styles.cardWrapper} key={key}>
              <div className={styles.userCard}>
                {!showRes ? (
                  <img
                    src={user.gender === "male" ? maleImg : femaleImg}
                    alt="user"
                    className={styles.genderImg}
                  />
                ) : null}
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
                  ? `${user.name}(Me)`
                  : user.name}
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

export default UsersList;
