import IUser from "../types/IUser";
import { sleep } from "../utils/sleep";
import { usersSeed } from "./seed";

export default async function fetchUsers(): Promise<IUser[]> {
  sleep(1000);
  return usersSeed;
}
