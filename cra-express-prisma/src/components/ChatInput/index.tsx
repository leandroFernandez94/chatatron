import React, { ChangeEventHandler, FormEventHandler } from "react";
import styles from "./ChatInput.module.css";

type ChatInputProps = {
  value: string;
  handleSendMessage: (message: string) => unknown;
  handleChangeValue: ChangeEventHandler<HTMLInputElement>;
};

export default function ChatInput({
  value,
  handleChangeValue,
  handleSendMessage,
}: ChatInputProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const elements = new FormData(e.currentTarget);
    const message = elements.get("chat-textarea");
    if (typeof message === "string" && message.length > 0) {
      handleSendMessage(message);
    }
  };

  return (
    <div id={styles.chatInput}>
      <form id={styles.chatInputForm} onSubmit={handleSubmit}>
        <input
          placeholder={"chat..."}
          id={styles.chatInputTextarea}
          name="chat-textarea"
          value={value}
          autoComplete="off"
          onChange={handleChangeValue}
        />
        <button type="submit" id={styles.chatInputButton}>
          Send
        </button>
      </form>
    </div>
  );
}
