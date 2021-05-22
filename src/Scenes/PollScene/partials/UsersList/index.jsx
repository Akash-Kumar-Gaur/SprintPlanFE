import React from "react";
import styles from "../../index.module.scss";
import votedImg from "../../../../Assets/Images/voted.png";

function UsersList({ users }) {
  return (
    <>
      {users.map((user, key) => {
        return (
          <div className={styles.cardWrapper} key={key}>
            <div className={styles.userCard}>
              {user.voted && (
                <img src={votedImg} alt="voted" className={styles.votedImg} />
              )}
            </div>
            <div>{user.name}</div>
          </div>
        );
      })}
    </>
  );
}

export default UsersList;
