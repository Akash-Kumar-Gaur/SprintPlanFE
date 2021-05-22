import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router";
import { enterUser } from "../../../../utils/database.utils";
import firebase from "firebase";

function NameInput({ close, isInvalidRoom }) {
  const [name, setName] = useState("");
  let { pollId } = useParams();
  let history = useHistory();

  const pushUser = () => {
    const userRef = firebase.database().ref(pollId);
    userRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          for (let id in users) {
            if (users[id].name === name) {
              alert("User with same name already in room!!");
              setName("");
              break;
            } else {
              window.localStorage.setItem("loggedUser", name);
              enterUser(name, pollId);
              close();
            }
          }
        } else {
          console.log("No data available");
          window.localStorage.setItem("loggedUser", name);
          enterUser(name, pollId);
          close();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInput = (e) => {
    setName(e.target.value);
  };

  return (
    <form noValidate autoComplete="off" onSubmit={pushUser}>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h3>
          {isInvalidRoom ? "Invalid Room ID !!!" : "Please enter your name"}
        </h3>
        {!isInvalidRoom ? (
          <TextField
            id="outlined-basic"
            variant="outlined"
            onChange={(e) => handleInput(e)}
            fullWidth
            required
            value={name}
          />
        ) : null}
        <Button
          variant="contained"
          color="primary"
          disabled={!name.length && !isInvalidRoom}
          onClick={() => {
            if (isInvalidRoom) {
              history.replace("/");
            } else {
              if (name.length) {
                pushUser();
              }
            }
          }}
          style={{
            marginTop: "30px",
          }}
        >
          {isInvalidRoom ? "Go back Home" : "Start Game"}
        </Button>
      </div>
    </form>
  );
}

export default NameInput;
