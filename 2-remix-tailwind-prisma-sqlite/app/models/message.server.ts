import { prisma } from "~/db.server";

export async function getMessagesByRoomId(roomId: number) {
  return prisma.message.findMany({
    where: { roomId },
  });
}

export async function createMessage(
  roomId: number,
  authorId: number,
  text: string
) {
  return prisma.message.create({
    data: { roomId, authorId, text },
  });
}
