import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Popup from "reactjs-popup";
import NameInput from "./partials/NameInput";
import firebase from "firebase";
import styles from "./index.module.scss";
import PollResults from "./partials/PollResults";
import UsersList from "./partials/UsersList";
import Button from "@material-ui/core/Button";

function PollScene() {
  let { pollId } = useParams();
  const [loggedUsers, setLoggedUsers] = useState([]);
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);

  let history = useHistory();

  useEffect(() => {
    getLoggedUsers();
  }, []);

  const getLoggedUsers = () => {
    const userRef = firebase.database().ref(pollId);
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
        const currentRef = firebase.database().ref(pollId).child(loggedId);
        currentRef
          .onDisconnect()
          .remove(window.localStorage.removeItem("loggedUser"));
      }
    });
  };

  return (
    <div className={styles.pollScene}>
      <div className={styles.brandName}>SprintPlan</div>
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
                  .ref(pollId)
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
        <PollResults
          loggedUsers={loggedUsers}
          setIsInvalidRoom={() => setIsInvalidRoom(true)}
        />
      </div>
      <div className={styles.usersWrapper}>
        {loggedUsers && loggedUsers.length ? (
          <UsersList users={loggedUsers} />
        ) : (
          <h3>Waiting for others to join</h3>
        )}
      </div>
    </div>
  );
}

export default PollScene;
