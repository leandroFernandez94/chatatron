import IUser from "../types/IUser";
import { usersSeed } from "./seed";

export default function fetchUsers(): Promise<IUser[]> {
  return Promise.resolve(usersSeed);
}
