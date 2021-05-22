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

function CreatePollForm({ close }) {
  const [roomName, setRoomName] = useState("");
  const [series, setSeries] = useState([]);
  const [allCanSee, setAllCanSee] = useState(false);

  const handleSeriesSelect = (event) => {
    setSeries(event.target.value);
  };

  const handleAccesSelect = (event) => {
    setAllCanSee(event.target.value);
  };

  const SERIES = [
    ["0", "1", "2", "3", "5", "8", "13", "21"],
    ["0", "1/2", "1", "2", "3", "5", "8", "13"],
  ];

  let history = useHistory();

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
      url: "/polls",
      data: { roomName, series: createSeries, allCanSee },
    }).then((res) => {
      const response = res.data;
      history.push(`/pollRoom/${response.roomId}`);
    });
    //
    close();
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
                {SERIES[0].map((entry) => `${entry}, `)}
              </MenuItem>
              <MenuItem value={`${SERIES[1]}`}>
                {SERIES[1].map((entry) => `${entry}, `)}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.formField}>
          <FormControl variant="outlined" fullWidth>
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
          </FormControl>

          <div className={styles.playBtn}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => createPoll()}
              disabled={!roomName.length || !series}
            >
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePollForm;
