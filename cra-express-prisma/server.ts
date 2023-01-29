import { PrismaClient, type User } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

app.post(`/login`, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    res.json({ error: `No user found for email: ${email}` });
  }

  res.json(user);
});

app.get("/rooms", async (__, res) => {
  const rooms = await prisma.room.findMany({
    include: {
      users: true,
      messages: true,
    },
  });
  res.json(rooms);
});

app.post(`/post-message`, async (req, res) => {
  const { authorId, roomId, content } = req.body;
  const message = await prisma.message.create({
    data: {
      text: content,
      authorId: Number(authorId),
      roomId: Number(roomId),
    },
  });

  res.json(message);
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
