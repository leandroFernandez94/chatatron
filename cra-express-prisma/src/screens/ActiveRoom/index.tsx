import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ChatInput from "../../components/ChatInput";
import Message from "../../components/Message";
import StoreContext from "../../contexts/StoreContext";
import { fetchMessages } from "../../services/fetchMessages";
import fetchUsers from "../../services/fetchUsers";
import { saveUserEmail } from "../../utils/localstorage";

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
    inactiveRooms,
    setActiveRoom,
  } = useContext(StoreContext);

  const [loadingData, setLoadingData] = useState(false);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  const history = useHistory();

  // a function that loads messages and users and sets them in the context
  async function loadMessagesAndUsers() {
    try {
      setLoadingData(true);
      setErrorLoading(null);
      const [messages, users] = await Promise.all([
        fetchMessages(),
        fetchUsers(),
      ]);
      setMessages(messages);
      setUsers(users);
    } catch (err) {
      if (err instanceof Error) {
        setErrorLoading(err.message);
      } else {
        setErrorLoading("Something went wrong X(");
      }
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadMessagesAndUsers();
  }, []);

  function onChatInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessageInputValue(e.target.value);
  }

  function handleChangeRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const roomId = (
      (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    ).name;
    setActiveRoom(roomId);
    history.push(`/room/${roomId}`);
  }

  function handleLogout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    saveUserEmail(undefined);
    history.push("/");
  }

  return (
    <main id={styles.chat}>
      {
        // if loadingData is true, show a loading message
        loadingData && <p>Loading...</p>
      }
      {
        // if errorLoading is not null, show the error message
        errorLoading && <p>{errorLoading}</p>
      }
      {
        // if loadingData is false and errorLoading is null, show the chat
        !loadingData && !errorLoading && (
          <>
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
            <section id={styles.roomMenu}>
              <form onSubmit={handleLogout} className={styles.logoutContainer}>
                <button type="submit">Logout ⬅️</button>
              </form>
              <div className={styles.changeRoomContainer}>
                <h3>Pick another room:</h3>
                <form onSubmit={handleChangeRoom}>
                  {inactiveRooms.map((room) => {
                    return (
                      <button key={room.id} name={room.id} type="submit">
                        {room.name}
                      </button>
                    );
                  })}
                </form>
              </div>
            </section>
          </>
        )
      }
    </main>
  );
}
