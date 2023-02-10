import { RoomWithUsersIds } from "../types/IRoom";
import request from "./request";

export default async function fetchRoomsWithUsers(
  userId: number
): Promise<RoomWithUsersIds[]> {
  console.log("userId::", userId);
  const rooms: RoomWithUsersIds[] = await request(`/rooms/${userId}`);
  return rooms;
}
