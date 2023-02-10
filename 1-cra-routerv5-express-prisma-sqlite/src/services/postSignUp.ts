import { User } from "@prisma/client";
import request from "./request";

export async function postSignUp(name: string, email: string): Promise<User> {
  try {
    const user: User = await request("/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    return user;
  } catch (error) {
    console.error(error);
    throw new Error("User not found");
  }
}
