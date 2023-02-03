import { Message } from "@prisma/client";
import request from "./request";

export async function postMessage(
  userId: number,
  roomId: number,
  message: string
): Promise<Message> {
  try {
    const newMessage = await request("/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authorId: userId,
        roomId,
        content: message,
      }),
    });

    return newMessage;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to post message");
  }
}
