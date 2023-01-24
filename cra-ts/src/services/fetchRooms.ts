import { IRoom } from "../types/IRoom";
import { roomsSeed } from "./seed";

export default function fetchRooms(): Promise<IRoom[]> {
  return Promise.resolve(roomsSeed);
}
