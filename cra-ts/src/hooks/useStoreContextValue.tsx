import { useState } from "react";
// @ts-ignore
import uuid from "uuid-v4";
import { StoreContextType } from "../contexts/StoreContext";
import { IMessage } from "../types/IMessage";
import { IRoom } from "../types/IRoom";
import IUser from "../types/IUser";

export default function useStoreContextValue(): StoreContextType {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<IRoom | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [activeUser, setActiveUser] = useState<IUser | null>(null);
  const [messageInputValue, setMessageInputValue] = useState("");

  const activeRoomMessages = messages.filter(
    (message) => message.roomId === activeRoom?.id
  );

  const usersMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as { [key: string]: IUser });

  function addMessage(message: string) {
    const newMessages = [
      ...messages,
      {
        text: message,
        id: uuid(),
        userId: activeUser?.id!,
        roomId: activeRoom?.id!,
      },
    ];
    setMessages(newMessages);
    setMessageInputValue("");
  }

  return {
    // state
    messages,
    rooms,
    users,
    activeUser,
    activeRoom,
    messageInputValue,

    // computed from state
    activeRoomMessages,
    usersMap,

    // actions
    setUsers,
    setRooms,
    setMessages,
    setActiveUser,
    setActiveRoom,
    addMessage,
    setMessageInputValue,
  };
}
