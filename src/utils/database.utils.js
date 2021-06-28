import firebase from "firebase";

const enterUserNow = (name, pollId, gender) => {
  const userRef = firebase.database().ref(pollId + "/users");
  const user = {
    name,
    voted: false,
    voteValue: "",
    gender: gender,
  };
  userRef.push(user);
};

async function getUserGenderV2(name, pollId) {
  await fetch(
    `https://genderapi.io/api/?name=${name}&key=60c7214d43e98b45213745a2`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        enterUserNow(name, pollId, data.gender);
      } else {
        enterUserNow(name, pollId, "none");
      }
    });
}

export const enterUser = (name, pollId) => {
  // getUserGenderV2(name, pollId);
  enterUserNow(name, pollId, "none");
};

export const getCurrentUser = () => firebase.auth().currentUser;

export function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
