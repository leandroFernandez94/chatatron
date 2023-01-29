import { IMessage } from "../types/IMessage";
import { sleep } from "../utils/sleep";
import { messagesSeed } from "./seed";

export async function fetchMessages(): Promise<IMessage[]> {
  await sleep(1000);
  return messagesSeed;
}
