import React from "react";
import styles from "../../index.module.scss";
import votedImg from "../../../../Assets/Images/voted.png";
import { getUniqueListBy } from "../../../../utils/database.utils";

function UsersList({ users }) {
  const filterUsers = getUniqueListBy(users, "name");
  return (
    <div className={styles.usersDiv}>
      <div className={styles.joined}>Joined Users:</div>
      <div className={styles.wrapperBox}>
        {filterUsers.map((user, key) => {
          return (
            <div className={styles.cardWrapper} key={key}>
              <div className={styles.userCard}>
                {user.voted && (
                  <img src={votedImg} alt="voted" className={styles.votedImg} />
                )}
              </div>
              <div className={styles.userName}>{user.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersList;
