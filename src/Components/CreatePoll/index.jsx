import React, { useState } from "react";
import styles from "./index.module.scss";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import axios from "axios";
import { useToasts } from "react-toast-notifications";

function CreatePollForm({ close }) {
  const [roomName, setRoomName] = useState("");
  const [series, setSeries] = useState([]);
  // const [allCanSee, setAllCanSee] = useState(false);
  const [creatingPoll, setCreatingPoll] = useState(false);

  const handleSeriesSelect = (event) => {
    setSeries(event.target.value);
  };

  // const handleAccesSelect = (event) => {
  //   setAllCanSee(event.target.value);
  // };

  const SERIES = [
    ["0", "1", "2", "3", "5", "8", "13", "21"],
    ["0", "1/2", "1", "2", "3", "5", "8", "13"],
  ];

  let history = useHistory();
  const { addToast } = useToasts();

  const createPoll = () => {
    // axios.get("/poll/2cedb783-9ec5-4070-90be-e82005987c62").then((res) => {
    //   const response = res.data;
    //   console.log("response", response);
    // });
    // history.push("/poll/2cedb783-9ec5-4070-90be-e82005987c62");

    //PROD
    const createSeries = series.split(",");
    axios({
      method: "post",
      url: "https://sprintplanbe.herokuapp.com/polls",
      data: { roomName, series: createSeries },
    })
      .then((res) => {
        const response = res.data;
        history.push(`/pollRoom/${response.roomId}`);
        setCreatingPoll(false);
        addToast("Poll created !!", {
          autoDismiss: 2000,
          autoDismissTimeout: 2000,
          appearance: "success",
        });
        close();
      })
      .catch((err) => {
        console.log("createError", err);
        addToast("Something went wrong!!!", {
          autoDismiss: 2000,
          autoDismissTimeout: 2000,
          appearance: "error",
        });
        setCreatingPoll(false);
        // close();
      });
    //
  };

  return (
    <div className={styles.pollform}>
      Start New Game
      <div className={styles.form}>
        <div className={styles.formField}>
          <TextField
            id="outlined-basic"
            label="Enter Game's Name"
            variant="outlined"
            onChange={(e) => setRoomName(e.target.value)}
            fullWidth
            required
          />
        </div>
        <div className={styles.formField}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-customized-select-label">Series</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Series"
              onChange={handleSeriesSelect}
              fullWidth
              required
            >
              <MenuItem value={`${SERIES[0]}`}>
                {SERIES[0].map((entry, key) =>
                  key < SERIES[0].length - 1 ? `${entry}, ` : entry
                )}
              </MenuItem>
              <MenuItem value={`${SERIES[1]}`}>
                {SERIES[1].map((entry, key) =>
                  key < SERIES[0].length - 1 ? `${entry}, ` : entry
                )}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.formField}>
          {/* <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-customized-select-label">
              Who can show cards?
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Who can view results?"
              fullWidth
              onChange={handleAccesSelect}
              required
            >
              <MenuItem value={false}>Only Me</MenuItem>
              <MenuItem value={true}>Everyone</MenuItem>
            </Select>
          </FormControl> */}

          <div className={styles.playBtn}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCreatingPoll(true);
                createPoll();
              }}
              disabled={!roomName.length || !series || creatingPoll}
            >
              {creatingPoll ? "Creating poll" : "Start Game"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePollForm;
