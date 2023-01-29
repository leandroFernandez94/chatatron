import IUser from "../types/IUser";
import { sleep } from "../utils/sleep";
import { usersSeed } from "./seed";

export async function login(email: string): Promise<IUser> {
  await sleep(1000);

  const user = usersSeed.find((user) => user.email === email);
  if (user) {
    return user;
  }
  throw new Error("User not found");
}
