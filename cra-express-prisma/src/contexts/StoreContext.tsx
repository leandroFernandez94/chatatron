import { Message, Room, User } from "@prisma/client";
import { createContext } from "react";

export interface StoreContextType {
  // state
  bootstrapped: boolean;
  users: User[];
  rooms: Room[];
  activeUser: User | null;
  activeRoom: Room | null;
  messageInputValue: string;

  // computed from state
  inactiveRooms: Room[];
  roomMessages: Map<number, Message[]>;
  usersMap: Map<number, User>;

  // actions
  bootstrap: () => void;
  login: (email: string) => void;
  logoutUser: () => void;
  loadUserRooms: () => void;
  setActiveRoomId: (roomId: number) => void;
  sendMessage: (message: string) => void;
  setMessageInputValue: (value: string) => void;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export default StoreContext;
