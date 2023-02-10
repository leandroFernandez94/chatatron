import { Message, Room, User } from "@prisma/client";
import { useMemo, useState } from "react";
import { StoreContextType } from "../contexts/StoreContext";
import { routes } from "../Router";
import { fetchAllRooms } from "../services/fetchAllRooms";
import { fetchMessages } from "../services/fetchMessages";
import fetchRoomsWithUsers from "../services/fetchRooms";
import { fetchUserById } from "../services/fetchUserById";
import { getMe } from "../services/getMe";
import { logout } from "../services/logout";
import { postLogin } from "../services/postLogin";
import { postMessage } from "../services/postMessage";
import { postSignUp } from "../services/postSignUp";
import { setUserRooms } from "../services/setUserRooms";

export default function useStoreContextValue(): StoreContextType {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [initialRooms, setInitialRooms] = useState<Room[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomMessages, setRoomMessages] = useState<Map<number, Message[]>>(
    new Map()
  );
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [messageInputValue, setMessageInputValue] = useState("");

  const inactiveRooms = useMemo(
    () => rooms.filter((room) => room.id !== activeRoom?.id),
    [rooms, activeRoom]
  );

  const usersMap = useMemo(() => {
    const map = new Map<number, User>();
    users.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  async function bootstrap() {
    try {
      const isLoginPath = window.location.pathname === routes.login;
      const me = await getMe();
      if (me && isLoginPath) {
        window.location.replace(routes.selectRoom);
      } else if (!me && !isLoginPath) {
        window.location.replace(routes.login);
      }
      setActiveUser(me);
    } catch (err) {
      console.error(err);
    } finally {
      setBootstrapped(true);
    }
  }

  async function login(email: string) {
    const user = await postLogin(email);
    console.log(user);
    setActiveUser(user);
  }

  async function signUp(name: string, email: string) {
    const user = await postSignUp(name, email);
    setActiveUser(user);
  }

  async function logoutUser() {
    await logout();
    setActiveUser(null);
    setActiveRoom(null);
    setRooms([]);
    setUsers([]);
    setRoomMessages(new Map());
  }

  async function loadInitialRooms() {
    const rooms = await fetchAllRooms();
    setInitialRooms(rooms);
  }

  async function loadUserRooms() {
    console.log("activeUser", activeUser);
    if (!activeUser) return;

    const rooms = await fetchRoomsWithUsers(activeUser.id);

    const uniqueUsers = Array.from(
      new Set(rooms.map((room) => room.userIds).flat())
    );
    const users = await Promise.all(
      uniqueUsers.map(async (userId) => {
        const user = await fetchUserById(userId);
        return user;
      })
    );

    console.log("rooms", rooms);
    console.log("users", users);

    setUsers(users);
    setRooms(rooms);
  }

  async function selectInitialRooms(roomIds: number[]) {
    if (!activeUser) throw new Error("No active user");
    setUserRooms(activeUser.id, roomIds);
  }

  async function loadRoomMessages(roomId: number) {
    const messages = await fetchMessages(roomId);
    setRoomMessages((prev) => new Map(prev).set(roomId, messages));
  }

  async function setActiveRoomId(roomId: number) {
    const foundRoom = rooms.find((room) => room.id === roomId) || null;
    setActiveRoom(foundRoom);
    if (foundRoom) {
      return loadRoomMessages(foundRoom.id);
    }
  }

  async function sendMessage(content: string) {
    if (!activeRoom || !activeUser) return;
    const userId = activeUser.id;
    const roomId = activeRoom.id;
    const message = await postMessage(userId, roomId, content);

    roomMessages.set(roomId, [...(roomMessages.get(roomId) || []), message]);
    setMessageInputValue("");
  }

  return {
    // state
    bootstrapped,
    rooms,
    initialRooms,
    users,
    activeUser,
    activeRoom,
    messageInputValue,

    // computed from state
    inactiveRooms,
    roomMessages,
    usersMap,

    // actions
    bootstrap,
    login,
    signUp,
    logoutUser,
    loadInitialRooms,
    selectInitialRooms,
    loadUserRooms,
    setActiveRoomId,
    sendMessage,
    setMessageInputValue,
  };
}
