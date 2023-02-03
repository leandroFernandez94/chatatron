import { Message } from "@prisma/client";
import { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ChatInput from "../../../components/ChatInput";
import MessageComponent from "../../../components/Message";
import StoreContext from "../../../contexts/StoreContext";

import styles from "./ActiveRoom.module.css";

export default function ActiveRoomScreen() {
  const {
    messageInputValue,
    setMessageInputValue,
    inactiveRooms,
    sendMessage,
    usersMap,
    roomMessages,
    setActiveRoomId,
    logoutUser,
  } = useContext(StoreContext);

  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    setActiveRoomId(Number(roomId));
  }, []);

  const activeRoomMessages: Message[] =
    roomMessages.get(Number(roomId)) || ([] as Message[]);

  const history = useHistory();

  function onChatInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessageInputValue(e.target.value);
  }

  function handleChangeRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const roomId = (
      (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    ).name;
    setActiveRoomId(Number(roomId));
    history.push(`/rooms/${roomId}`);
  }

  async function handleLogout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await logoutUser();
    history.push("/");
  }

  async function addMessage(message: string) {
    sendMessage(message);
  }

  return (
    <main id={styles.chat}>
      <section id={styles.activeRoom}>
        <div id={styles.roomMessages}>
          {activeRoomMessages.map((message, index) => {
            return (
              <MessageComponent
                key={index}
                text={message.text}
                user={usersMap.get(message.authorId)!}
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
                <button key={room.id} name={room.id.toString()} type="submit">
                  {room.name}
                </button>
              );
            })}
          </form>
        </div>
      </section>
    </main>
  );
}
