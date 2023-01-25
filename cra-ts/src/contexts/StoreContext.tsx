import { createContext } from "react";
import { IMessage } from "../types/IMessage";
import { IRoom } from "../types/IRoom";
import IUser from "../types/IUser";

export interface StoreContextType {
  // state
  users: IUser[];
  rooms: IRoom[];
  messages: IMessage[];
  activeUser: IUser | null;
  activeRoom: IRoom | null;
  messageInputValue: string;

  // computed from state
  activeRoomMessages: IMessage[];
  usersMap: { [key: string]: IUser };
  inactiveRooms: IRoom[];

  // actions
  setUsers: (users: IUser[]) => void;
  setRooms: (rooms: IRoom[]) => void;
  setMessages: (messages: IMessage[]) => void;
  setActiveUser: (user: IUser) => void;
  setActiveRoom: (roomId: string) => void;
  addMessage: (message: string) => void;
  setMessageInputValue: (value: string) => void;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export default StoreContext;
