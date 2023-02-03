import { PrismaClient, UserSession, type User } from "@prisma/client";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import cookieParser from "cookie-parser";

const prisma = new PrismaClient();
const app = express();

const sessionTokenId = "session-token";

app.use(
  cors({
    origin: "http://localhost:4001",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function getUserBySessionToken(token: string): Promise<User | null> {
  const session = await prisma.userSession.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  return session?.user ?? null;
}

async function createUserSession(
  userId: number
): Promise<UserSession["token"]> {
  const session = await prisma.userSession.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      token: randomUUID(),
    },
  });

  return session.token;
}

app.post(`/login`, async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    res.json({ error: `No user found for email: ${email}` });
    return;
  }

  const token = await createUserSession(user.id);

  res.cookie(sessionTokenId, token).send(user);
});

app.get(`/me`, async (req, res) => {
  const token = (req.cookies && req.cookies[sessionTokenId]) || "";
  const user = await getUserBySessionToken(token);

  res.json(user);
});

app.post(`/logout`, async (req, res) => {
  const token = req.cookies[sessionTokenId];
  await prisma.userSession.delete({
    where: { token },
  });

  res.clearCookie(sessionTokenId);
  res.json({ success: true });
});

app.get("/rooms/:userId", async (req, res) => {
  const { userId } = req.params;

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

  res.json(roomsWithUserIds);
});

app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    res.json({ error: `No user found for id: ${userId}` });
    return;
  }

  res.json(user);
});

app.get("/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const messages = await prisma.message.findMany({
    where: {
      roomId: Number(roomId),
    },
  });

  res.json(messages);
});

app.post(`/message`, async (req, res) => {
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

app.listen(4000, () =>
  console.log(`
🚀 Server ready at: http://localhost:4000`)
);
