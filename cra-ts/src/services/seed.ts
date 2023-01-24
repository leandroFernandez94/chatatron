import IUser from "../types/IUser";
import { faker } from "@faker-js/faker";
import { IRoom } from "../types/IRoom";
import { IMessage } from "../types/IMessage";

export const usersSeed: IUser[] = [
  {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  },
  {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  },
  {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  },
  {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  },
  {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
  },
];

const [user1, user2, user3, user4, user5] = usersSeed;

export const roomsSeed: IRoom[] = [
  {
    id: faker.datatype.uuid(),
    name: "general",
    users: usersSeed,
  },
  {
    id: faker.datatype.uuid(),
    name: "random",
    users: [user1, user2, user3],
  },
  {
    id: faker.datatype.uuid(),
    name: "jokes",
    users: [user3, user4, user5],
  },
  {
    id: faker.datatype.uuid(),
    name: "memes",
    users: [user1, user2, user5],
  },
];

const [generalRoom, randomRoom, jokesRoom, memesRoom] = roomsSeed;

export const messagesSeed: IMessage[] = [
  {
    id: faker.datatype.uuid(),
    text: "Welcome to General!",
    userId: user1.id,
    roomId: generalRoom.id,
  },
  {
    id: faker.datatype.uuid(),
    text: "Here we post serious stuff",
    userId: user2.id,
    roomId: generalRoom.id,
  },
  {
    id: faker.datatype.uuid(),
    text: "Welcome to Random!",
    userId: user1.id,
    roomId: randomRoom.id,
  },
  {
    id: faker.datatype.uuid(),
    text: "Here we post random stuff",
    userId: user3.id,
    roomId: randomRoom.id,
  },
  {
    id: faker.datatype.uuid(),
    text: "Welcome to Jokes!",
    userId: user3.id,
    roomId: jokesRoom.id,
  },
  {
    id: faker.datatype.uuid(),
    text: "Here we post jokes",
    userId: user4.id,
    roomId: jokesRoom.id,
  },
  {
    id: faker.datatype.uuid(),
    text: "Welcome to Memes!",
    userId: user1.id,
    roomId: memesRoom.id,
  },
  {
    id: faker.datatype.uuid(),
    text: "Here we post memes",
    userId: user5.id,
    roomId: memesRoom.id,
  },
];
