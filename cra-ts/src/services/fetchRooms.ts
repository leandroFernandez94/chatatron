import { IRoom } from "../types/IRoom";
import IUser from "../types/IUser";
import { roomsSeed } from "./seed";

export default function fetchRooms(
  activeUser?: IUser | null
): Promise<IRoom[]> {
  if (!activeUser) return Promise.resolve(roomsSeed);

  return Promise.resolve(
    roomsSeed.filter((room) => room.users.includes(activeUser.id))
  );
}
