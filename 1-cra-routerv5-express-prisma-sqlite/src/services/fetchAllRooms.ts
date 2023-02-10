import { Room } from "@prisma/client";
import request from "./request";

export async function fetchAllRooms(): Promise<Room[]> {
  const rooms: Room[] = await request(`/initial-rooms`);
  return rooms;
}
