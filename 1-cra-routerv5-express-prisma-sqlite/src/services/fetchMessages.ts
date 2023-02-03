import { Message } from "@prisma/client";
import request from "./request";

export async function fetchMessages(roomId: number): Promise<Message[]> {
  try {
    const messages: Message[] = await request(`/messages/${roomId}`);
    return messages;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch messages");
  }
}
