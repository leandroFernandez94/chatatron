import { IRoom } from "../types/IRoom";
import IUser from "../types/IUser";
import { sleep } from "../utils/sleep";
import { roomsSeed } from "./seed";

export default async function fetchRooms(
  activeUser?: IUser | null
): Promise<IRoom[]> {
  await sleep(1000);
  if (!activeUser) return roomsSeed;

  return roomsSeed.filter((room) => room.users.includes(activeUser.id));
}
