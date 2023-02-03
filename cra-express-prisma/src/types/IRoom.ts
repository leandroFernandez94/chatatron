import { Room } from "@prisma/client";

export type RoomWithUsersIds = Room & {
  userIds: number[];
};
