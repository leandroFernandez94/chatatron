import React from "react";
import IUser from "../../types/IUser";
import styles from "./Message.module.css";

type MessageProps = {
  text: string;
  user: IUser;
};

export default function Message({ text, user }: MessageProps) {
  return (
    <div className={styles.message}>
      <p className={styles.messageUser}>{user.name}</p>
      <p className={styles.messageBody}>{text}</p>
    </div>
  );
}
