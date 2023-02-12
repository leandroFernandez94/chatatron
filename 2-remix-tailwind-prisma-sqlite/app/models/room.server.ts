import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getUserRooms(userId: User["id"]) {
  await prisma.$connect();

  const rooms = await prisma.room.findMany({
    where: {
      users: {
        some: {
          userId: Number(userId),
        },
      },
    },
    include: {
      users: true,
    },
  });

  const roomsWithUserIds = rooms.map((room) => {
    const { users, ...roomWithoutUsers } = room;
    const userIds = users.map((user) => user.userId);
    return { ...roomWithoutUsers, userIds };
  });

  return roomsWithUserIds;
}

export async function getInitialRooms() {
  return prisma.room.findMany();
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function setUserRooms(userId: User["id"], roomIds: number[]) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      rooms: {
        connect: roomIds.map((id) => ({
          userId_roomId: { userId, roomId: id },
        })),
      },
    },
  });
}
