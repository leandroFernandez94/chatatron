import React, { useEffect, useMemo, useState } from "react";
import ChatInput from "./components/ChatInput";
import styles from "./App.module.css";
import Message from "./components/Message";
// @ts-ignore
import uuid from "uuid-v4";
import { fetchMessages } from "./services/fetchMessages";
import { IMessage } from "./types/IMessage";
import IUser from "./types/IUser";
import { IRoom } from "./types/IRoom";
import fetchRooms from "./services/fetchRooms";
import fetchUsers from "./services/fetchUsers";

function getUsersMapById(users: IUser[]): { [key: string]: IUser } {
  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as { [key: string]: IUser });
}

function App() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const [messageInputValue, setMessageInputValue] = useState("");
  useEffect(() => {
    Promise.all([fetchMessages(), fetchRooms(), fetchUsers()]).then(
      ([messagesResult, roomsResult, usersResult]) => {
        setMessages(messagesResult);
        setRooms(roomsResult);
        setUsers(usersResult);
      }
    );
  }, []);

  const activeUser = useMemo(() => {
    if (users.length === 0) return null;
    return users[0];
  }, [users]);

  const activeRoom = useMemo(() => {
    if (rooms.length === 0) return null;
    return rooms[0];
  }, [rooms]);

  const activeRoomMessages = useMemo(() => {
    return messages.filter((message) => message.roomId === activeRoom?.id);
  }, [messages, activeRoom]);

  const usersMap = useMemo(() => {
    return getUsersMapById(users);
  }, [users]);

  function addMessage(message: string) {
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        text: message,
        id: uuid(),
        userId: activeUser?.id!,
        roomId: activeRoom?.id!,
      },
    ]);
    setMessageInputValue("");
  }

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

export default App;
