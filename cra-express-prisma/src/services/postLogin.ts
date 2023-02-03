import { User } from "@prisma/client";
import request from "./request";

export async function postLogin(email: string): Promise<User> {
  try {
    const user: User = await request("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("User not found");
  }
}
