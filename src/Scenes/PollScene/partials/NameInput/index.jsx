import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router";
import { enterUser } from "../../../../utils/database.utils";
import firebase from "firebase";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

function NameInput({ close }) {
  const [name, setName] = useState("");
  let { pollId } = useParams();
  const [inProcess, setInProcess] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);

  const pushUser = () => {
    const userRef = firebase.database().ref(pollId + "/users");
    window.localStorage.setItem("loggedUserName", name);
    userRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          for (let id in users) {
            if (users[id].name === name) {
              setNameError(true);
              setName("");
              setInProcess(false);
              window.localStorage.removeItem("loggedUserName");
            } else {
              enterUser(name, pollId, isSpectator);
              setInProcess(false);
              close();
              break;
            }
          }
        } else {
          enterUser(name, pollId, isSpectator);
          const pollRef = firebase.database().ref(pollId + "/pollstatus");
          pollRef.update({ pollStatus: false });
          const resRef = firebase.database().ref(pollId + "/resultsShown");
          resRef.update({ resultsShown: false });
          const resetRef = firebase.database().ref(pollId + "/resetPolls");
          resetRef.set({ reset: false });
          setInProcess(false);
          close();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInput = (e) => {
    setNameError(false);
    setName(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      setInProcess(true);
      pushUser();
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h3>Please enter your name</h3>
      <TextField
        id="outlined-basic"
        variant="outlined"
        onKeyUp={(e) => handleEnter(e)}
        onChange={(e) => handleInput(e)}
        fullWidth
        required
        value={name}
        autoComplete="off"
        error={nameError}
        style={{
          position: "relative",
        }}
      />
      {nameError ? (
        <div
          style={{
            marginTop: "6px",
            fontSize: "12px",
            color: "red",
            position: "absolute",
          }}
        >
          User with same name already in room!!
        </div>
      ) : null}
      <div
        style={{
          width: "auto",
          marginTop: "10px",
          userSelect: "none",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isSpectator}
              onChange={() => setIsSpectator(!isSpectator)}
              name="spectator"
              color="primary"
            />
          }
          label="Join as Spectator ?????????????????"
        />
        <div
          style={{
            color: "#828282",
            fontSize: 12,
          }}
        >
          Spectators can't vote
        </div>
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!name.length || inProcess || nameError}
        onSubmit={() => {
          if (name.length) {
            pushUser();
          }
        }}
        onClick={() => {
          if (name.length) {
            setInProcess();
            pushUser();
          }
        }}
        style={{
          marginTop: "30px",
        }}
      >
        {inProcess ? "Joining" : "Start Game"}
      </Button>
    </div>
  );
}

export default NameInput;
