import { useContext, useEffect } from "react";
import ChatInput from "../components/ChatInput";
import Message from "../components/Message";
import StoreContext from "../contexts/StoreContext";
import { fetchMessages } from "../services/fetchMessages";
import fetchUsers from "../services/fetchUsers";

import styles from "./ActiveRoom.module.css";

export default function ActiveRoomScreen() {
  const {
    setMessages,
    activeRoomMessages,
    usersMap,
    addMessage,
    messageInputValue,
    setMessageInputValue,
    setUsers,
  } = useContext(StoreContext);

  useEffect(() => {
    Promise.all([fetchMessages(), fetchUsers()]).then(
      ([messagesResult, usersResult]) => {
        setMessages(messagesResult);
        setUsers(usersResult);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onChatInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessageInputValue(e.target.value);
  }

  return (
    <main id={styles.chat}>
      <section id={styles.activeRoom}>
        <div id={styles.roomMessages}>
          {activeRoomMessages.map((message, index) => {
            return (
              <Message
                key={index}
                text={message.text}
                user={usersMap[message.userId]}
              />
            );
          })}
        </div>
        <ChatInput
          handleSendMessage={addMessage}
          value={messageInputValue}
          handleChangeValue={onChatInputChange}
        />
      </section>
      {/* <section id={styles.extraFeatures}>
        <h3>Some other features will go here</h3>
      </section> */}
    </main>
  );
}
