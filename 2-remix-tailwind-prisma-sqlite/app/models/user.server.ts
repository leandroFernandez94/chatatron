import type { User, UserSession } from "@prisma/client";
import { randomUUID } from "crypto";
// import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserBySessionToken(
  token: UserSession["token"]
): Promise<User | null> {
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

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(email: User["email"], name: User["name"]) {
  // const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      name,
      // password: {
      //   create: {
      //     hash: hashedPassword,
      //   },
      // },
    },
  });
}

export async function login(email: User["email"]) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return null;
  }

  const token = await createUserSession(user.id);

  return { user, token };
}

export async function logout(token: UserSession["token"]) {
  return prisma.userSession.delete({ where: { token } });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

// export async function verifyLogin(
//   email: User["email"],
//   password: Password["hash"]
// ) {
//   const userWithPassword = await prisma.user.findUnique({
//     where: { email },
//     include: {
//       password: true,
//     },
//   });

//   if (!userWithPassword || !userWithPassword.password) {
//     return null;
//   }

//   const isValid = await bcrypt.compare(
//     password,
//     userWithPassword.password.hash
//   );

//   if (!isValid) {
//     return null;
//   }

//   const { password: _password, ...userWithoutPassword } = userWithPassword;

//   return userWithoutPassword;
// }
