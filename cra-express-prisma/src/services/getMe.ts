import { User } from "@prisma/client";
import request from "./request";

export async function getMe(): Promise<User | null> {
  const user = await request("/me");
  return user;
}
