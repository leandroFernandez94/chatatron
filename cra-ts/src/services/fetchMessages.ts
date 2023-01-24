import { IMessage } from "../types/IMessage";
import { messagesSeed } from "./seed";

export function fetchMessages(): Promise<IMessage[]> {
  return Promise.resolve(messagesSeed);
}
