import { User } from "@prisma/client";
import request from "./request";

export async function fetchUserById(userId: number): Promise<User> {
  const user = await request(`/users/${userId}`);
  return user;
}
