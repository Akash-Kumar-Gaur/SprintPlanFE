import firebase from "firebase";

export const setPollStatus = (pollId) => {
  const dbRef = firebase.database().ref(pollId + "/users");
  dbRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const tempUsers = [];
        for (let id in users) {
          if (users[id].voted) {
            const pollRef = firebase.database().ref(pollId + "/pollstatus");
            pollRef.update({ pollStatus: true });
            break;
          } else {
            console.log("nahi");
            const pollRef = firebase.database().ref(pollId + "/pollstatus");
            pollRef.update({ pollStatus: false });
          }
          tempUsers.push({ id, ...users[id] });
        }
      } else {
        console.log("No data available nhi");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

// export const setNotVoted = (pollId, currentUserId) => {
//   const userRef = firebase
//     .database()
//     .ref(pollId + "/users")
//     .child(currentUserId);
//   userRef.update({
//     voted: false,
//   });
// };

export function usersCount(pollId) {
  //   var ref = firebase.database().ref(pollId + "/users");
  //   ref.once("value").then(function (snapshot) {
  //     return snapshot.numChildren();
  //   });
  const dbRef = firebase.database().ref(pollId + "/users");
  dbRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.numChildren());
        return snapshot;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function setNotVoted(pollId, id) {
  const userRef = firebase
    .database()
    .ref(pollId + "/users")
    .child(id);
  userRef.update(
    {
      voted: false,
    },
    () => {
      setPollStatus(pollId);
    }
  );
}

export const restartPoll = (pollId) => {
  const dbRef = firebase.database().ref(pollId + "/users");
  dbRef
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (let id in users) {
          setNotVoted(pollId, id);
        }
      } else {
        console.log("No data available nhi");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
