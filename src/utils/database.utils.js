import firebase from "firebase";

export const enterUser = (name, pollId) => {
  const userRef = firebase.database().ref(pollId);
  const user = {
    name,
    voted: false,
    voteValue: "",
  };
  userRef.push(user);
};

export const getCurrentUser = () => firebase.auth().currentUser;

export function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
