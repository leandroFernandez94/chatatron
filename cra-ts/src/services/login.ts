import IUser from "../types/IUser";
import { usersSeed } from "./seed";

export function login(email: string): Promise<IUser> {
  return new Promise((resolve, reject) => {
    const user = usersSeed.find((user) => user.email === email);
    if (user) {
      resolve(user);
    }
    reject(new Error("User not found"));
  });
}
