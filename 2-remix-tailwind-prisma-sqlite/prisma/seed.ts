import { Prisma, PrismaClient, User, Room, Message } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

async function main() {
  const usersSeed: Prisma.UserCreateInput[] = [
    {
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
    {
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
    {
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
    {
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
    {
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
  ];

  // upsert users
  let users: User[] = [];
  for (let i = 0; i < usersSeed.length; i++) {
    users[i] = await prisma.user.upsert({
      where: { email: usersSeed[i].email },
      update: {},
      create: {
        email: usersSeed[i].email,
        name: usersSeed[i].name,
      },
    });
  }

  const [user1, user2, user3, user4, user5] = users;

  const roomsSeed: Array<Prisma.RoomCreateInput & { users: number[] }> = [
    {
      name: "general",
      users: users.map((user) => user.id),
    },
    {
      name: "random",
      users: [user1.id, user2.id, user3.id],
    },
    {
      name: "jokes",
      users: [user3.id, user4.id, user5.id],
    },
    {
      name: "memes",
      users: [user1.id, user2.id, user5.id],
    },
  ];

  // upsert rooms
  let rooms: Room[] = [];
  for (let i = 0; i < roomsSeed.length; i++) {
    rooms[i] = await prisma.room.create({
      data: {
        name: roomsSeed[i].name,
      },
    });
  }

  const [generalRoom, randomRoom, jokesRoom, memesRoom] = rooms;

  const messagesSeed: Array<Prisma.MessageCreateInput> = [
    {
      text: "Welcome to General!",
      author: {
        connect: { id: user1.id },
      },
      room: {
        connect: { id: generalRoom.id },
      },
    },
    {
      text: "Here we post serious stuff",
      author: {
        connect: { id: user2.id },
      },
      room: {
        connect: { id: generalRoom.id },
      },
    },
    {
      text: "Welcome to Random!",
      author: {
        connect: { id: user1.id },
      },
      room: {
        connect: { id: randomRoom.id },
      },
    },
    {
      text: "Here we post random stuff",
      author: {
        connect: { id: user3.id },
      },
      room: {
        connect: { id: randomRoom.id },
      },
    },
    {
      text: "Welcome to Jokes!",
      author: {
        connect: { id: user3.id },
      },
      room: {
        connect: { id: jokesRoom.id },
      },
    },
    {
      text: "Here we post jokes",
      author: {
        connect: { id: user4.id },
      },
      room: {
        connect: { id: jokesRoom.id },
      },
    },
    {
      text: "Welcome to Memes!",
      author: {
        connect: { id: user1.id },
      },
      room: {
        connect: { id: memesRoom.id },
      },
    },
    {
      text: "Here we post memes",
      author: {
        connect: { id: user5.id },
      },
      room: {
        connect: { id: memesRoom.id },
      },
    },
  ];

  // upsert messages
  let messages: Message[] = [];
  for (let i = 0; i < messagesSeed.length; i++) {
    await prisma.message.create({
      data: messagesSeed[i],
    });
  }

  // connect users to rooms
  for (let i = 0; i < roomsSeed.length; i++) {
    for (let j = 0; j < roomsSeed[i].users.length; j++) {
      await prisma.userOnRoom.create({
        data: {
          user: {
            connect: {
              id: roomsSeed[i].users[j],
            },
          },
          room: {
            connect: {
              id: rooms[i].id,
            },
          },
        },
      });
    }
  }

  console.log({ users, rooms, messages });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
